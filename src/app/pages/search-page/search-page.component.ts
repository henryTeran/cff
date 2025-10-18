import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../../services/api/api.service';
import { CompletionResponse } from '../../interfaces/completionResponse';
import { Connection, Leg, RouteResponse } from '../../interfaces/routeResponse';
import { DividePipe } from '../../pipes/divide.pipe';

const UIElement = [
  IonContent, 
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonDatetime, 
  IonHeader, 
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonCard, 
  IonLabel, 
  IonItem,
  IonDatetimeButton,
  IonCardContent,
  IonList,
  IonChip,
  IonModal, 
  IonSegmentButton, 
  IonFooter,
  IonImg
];

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  imports: [CommonModule, ...UIElement, FormsModule, DividePipe]
})
export class SearchPageComponent implements OnInit, OnDestroy {
  public completionResponseFrom: CompletionResponse = [];
  public completionResponseTo: CompletionResponse = [];
  public from: string = "";
  public to: string = ""
  public mode: 'depart' | 'arrival' = 'depart';

  private fromSearchSubject = new Subject<string>();
  private toSearchSubject = new Subject<string>();
  private abortController?: AbortController;
  public selectedDate: string = new Date().toISOString();;
  public showDateModal = false;
  public date: string = ""; 
  public dateConvert : string = "";
  public heure: string = "";
  public routesSearch?: RouteResponse; 
  public routeConnections?: Connection[]; 
  public routeLegs?: Leg[]; 
  public terminal: string = "";

  minDate: string = new Date().toISOString();
  maxDate: string = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString();

  constructor(
    private readonly _apiService: ApiService,
    private router: Router
  ) {
    this.setupDebounce();
  }

  ngOnInit() {
    this.validerDate();
    this.loadFromSession();
  }

  ngOnDestroy() {
    this.fromSearchSubject.complete();
    this.toSearchSubject.complete();
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private setupDebounce() {
    this.fromSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async (term) => {
      if (term.length >= 2) {
        await this.performCompletion(term, true);
      } else {
        this.completionResponseFrom = [];
      }
    });

    this.toSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async (term) => {
      if (term.length >= 2) {
        await this.performCompletion(term, false);
      } else {
        this.completionResponseTo = [];
      }
    });
  }
   
 

  onInput(destination: boolean) {
    if (destination) {
      this.fromSearchSubject.next(this.from);
    } else {
      this.toSearchSubject.next(this.to);
    }
  }

  private async performCompletion(term: string, isFrom: boolean) {
    try {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      const result = await this._apiService.completion(term, this.abortController.signal);

      if (isFrom) {
        this.completionResponseFrom = result;
      } else {
        this.completionResponseTo = result;
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Completion error:', error);
      }
    }
  }


  selectStation(Gare: string, destination: boolean) {
    if (destination) {
      this.from = Gare;
      this.completionResponseFrom = [];
    } else {
      this.to = Gare;
      this.completionResponseTo = [];
    }
  }

  swapStations() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }

  toggleModal() {
    this.showDateModal =! this.showDateModal;
    }

  validerDate() {
    if (!this.selectedDate) {
      console.warn("Aucune date sélectionnée !");
      return;
    }
  
    const date = new Date(this.selectedDate);
    this.dateConvert = this.convertDate(this.selectedDate);
    
    if (isNaN(date.getTime())) {
      console.error("Date invalide !");
      return;
    }
  
    this.date = date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month:'short',
      year: 'numeric'
    });
  
    this.heure = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    this.showDateModal = false;
  }
  
  async routeSearch() {
    if (!this.from || !this.to) {
      return;
    }

    try {
      const searchParams = {
        from: this.from,
        to: this.to,
        date: this.dateConvert,
        time: this.heure,
        timeType: this.mode,
        num: 5
      };

      this.saveToSession(searchParams);

      const result = await this._apiService.route(searchParams);
      this.routesSearch = result;
      this.routeConnections = result.connections;
      this.routeLegs = this.routeConnections?.flatMap(connection => connection.legs || []);

      this.router.navigate(['/result'], {
        state: {
          searchResult: result,
          searchParams
        }
      });
    } catch (error) {
      console.error('Route search error:', error);
    }
  }

  private saveToSession(params: any) {
    sessionStorage.setItem('lastSearch', JSON.stringify(params));
  }

  private loadFromSession() {
    const stored = sessionStorage.getItem('lastSearch');
    if (stored) {
      try {
        const params = JSON.parse(stored);
        this.from = params.from || '';
        this.to = params.to || '';
        this.mode = params.timeType || 'depart';
      } catch (error) {
        console.error('Error loading session:', error);
      }
    }
  } 
  convertDate (dateNonConvert:string) : string {
    const date = new Date(dateNonConvert);
    if (isNaN(date.getTime())) return 'Date invalide';

    const jour = String(date.getDate()).padStart(2, '0');
    const mois = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const annee = date.getFullYear();

    return `${jour}.${mois}.${annee}`;
  }
    getIcon(category: string): string {
      switch (category?.toLowerCase()) {
        case 'bus': return 'bus-outline';
        case 'train': return 'train-outline';
        case 'tram': return 'subway-outline';
        default: return 'navigate-outline';
      }
    }
    getLegCode(leg: Leg): string {
      return `${leg['*G'] ?? ''}${leg['*L'] ?? ''}`;
    }
    getDurationInMinutes(departure?: Date, arrival?: Date): number | null {
      if (!departure || !arrival) return null;
      const diffMs = new Date(arrival).getTime() - new Date(departure).getTime();
      return Math.round(diffMs / 60000); // en minutes
    }

    getDurationFormatted(departure?: Date, arrival?: Date): string | null {
      if (!departure || !arrival) return null;
      const diffMs = new Date(arrival).getTime() - new Date(departure).getTime();
      const totalMinutes = Math.round(diffMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (hours !== 0) {
        return `${hours} h ${minutes}min`;
      }
      else { 
        return `${minutes}min`;
      } 
    }
    
    hasAttributeInAnyLeg(legs: any[], key: string): boolean {
      return legs?.some(leg => {
        const keys = Object.keys(leg?.attributes || {});
        return keys.includes(key);
      });
    }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  navigateToOnboard() {
    if (this.routeConnections && this.routeConnections.length > 0) {
      this.router.navigate(['/onboard'], {
        state: { connection: this.routeConnections[0] }
      });
    }
  }
}
