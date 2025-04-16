import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
export class SearchPageComponent  implements OnInit {
  public completionResponseFrom: CompletionResponse = []; 
  public completionResponseTo: CompletionResponse = []; 
  public from: string = ""; 
  public to: string = ""
  public mode: 'depart' | 'arrivee' = 'depart';
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

  constructor(private readonly _apiService: ApiService) { 
  }

  ngOnInit() {
    this.validerDate();
   }
   
 

  async onInput( destination: boolean) {
   if (destination ) {
      const saisie = this.from;
      this.completionResponseFrom = await this._apiService.completion(saisie); 
      console.log(this.completionResponseFrom);
    } else {
      const saisie = this.to;
      this.completionResponseTo = await this._apiService.completion(saisie); 
      console.log(this.completionResponseTo);
    }
  }


  selectStation(Gare: string, destination :boolean) {
    if (destination) {
      this.from = Gare; 
      this.completionResponseFrom = [];
    }else{
      this.to = Gare; 
      this.completionResponseTo = [];
    }

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
  
  async routeSearch (){
    console.log(this.from, this.to, this.dateConvert,  this.heure);
    if(this.from ||this.to) {

      const result = await this._apiService.route({from: this.from, to: this.to, date: this.dateConvert, time: this.heure}); 
      this.routesSearch = result; 
      this.routeConnections = result.connections; 
      this.routeLegs = this.routeConnections?.flatMap(connection => connection.legs || []);
      //this.terminal = routeLegs[0].terminal; 
      console.log(result);
      console.log("routeConnections", this.routeConnections );
      console.log("routeLegs", this.routeLegs);
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



}
