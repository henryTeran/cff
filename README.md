# CFF App

Application web/mobile complète pour rechercher et suivre les horaires des transports publics CFF (SBB) avec notifications temps réel des perturbations.

## 🚀 Fonctionnalités

### Recherche d'itinéraires
- **Autocomplétion intelligente** des gares avec debounce (300ms)
- **Recherche flexible** : départ ou arrivée
- **Inversement rapide** des gares
- **Sélection date/heure** intuitive
- Affichage de 5 connexions avec détails complets

### Alertes temps réel
- **Polling automatique** toutes les 45 secondes
- **Détection des perturbations** (retards, changements de voie)
- **Notifications push** Web/Capacitor
- **Proposition automatique** d'itinéraires alternatifs
- **Deep-linking** vers les détails de l'alternative

### Pages
- **Recherche** : formulaire avec autocomplétion
- **Résultats** : liste des connexions avec toggle alertes
- **Détails** : itinéraire détaillé avec segments
- **À bord** : informations train + lecture vocale (TTS)
- **Paramètres** : préférences alertes et affichage

### Accessibilité (SBB Inclusive)
- **ARIA live regions** pour les annonces
- **Labels explicites** sur tous les contrôles
- **Gestion du focus** après recherche
- **Taille de police ajustable** (A+/A−)
- **Contraste élevé** (prefers-contrast: more)
- **Navigation clavier** complète (Enter, Tab)
- **Synthèse vocale** (Web Speech API)

### PWA
- **Installable** sur mobile et desktop
- **Mode hors-ligne** basique
- **Cache** des icônes et assets
- **Manifest** avec icônes SBB

### Internationalisation
- Structure i18n prête
- Français (défaut) et Allemand
- Service de traduction avec pipe `t`

## 🛠️ Stack technique

- **Angular 19** (standalone components)
- **Ionic 8.5.3**
- **TypeScript 5.7** (strict mode)
- **RxJS** pour la réactivité
- **API CFF** : https://timetable.search.ch/api/
- **PWA** support

## 📦 Installation

```bash
npm install
```

## 🔧 Développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 🏗️ Build

```bash
npm run build
```

Build de production dans `dist/`

## 🧪 Tests

### Tests unitaires
```bash
npm test
```

Couverture attendue :
- Services & utils : ≥ 80%
- Composants critiques : ≥ 60%

### Tests E2E
```bash
npx playwright install --with-deps
npx playwright test
```

Scénarios couverts :
- Autocomplétion → recherche → résultats
- Toggle Départ/Arrivée
- Détection perturbation → notification → deep-link
- Paramètres : persistance et effet UI
- Onboard : TTS

## 🔐 Permissions

### Notifications Web
L'application demande l'autorisation d'afficher des notifications pour alerter des perturbations.

**Configuration** :
- Chrome/Edge : Paramètres > Confidentialité > Notifications
- Firefox : Paramètres > Vie privée > Permissions > Notifications
- Safari : Préférences > Sites web > Notifications

### Capacitor (mobile natif)
Si packagée avec Capacitor, les permissions sont gérées automatiquement.

## 🌐 API

L'application utilise l'API publique CFF de `timetable.search.ch` :

- **Completion** : `/api/completion.fr.json?term={query}`
- **Route** : `/api/route.fr.json?from={from}&to={to}&date={dd.MM.yyyy}&time={HH:mm}&time_type={depart|arrival}&num=5&show_delays=1&show_trackchanges=1`

### Limitations
- **Pas de push temps réel** : polling toutes les 45s
- **Rate limiting** : respecter les limites de l'API
- **Pas de clé API** requise

## 💾 PWA & Offline

### Cache
- Icônes et assets statiques
- Réponses completion (60s, stale-while-revalidate)
- Pas de cache des itinéraires (données temps réel)

### Installation PWA
1. Ouvrir l'application dans un navigateur
2. Cliquer sur "Installer" dans la barre d'adresse
3. L'application apparaît comme une app native

## ♿ Accessibilité

### Mesures implémentées
- ✅ **ARIA live regions** : `aria-live="polite"` sur résultats et alertes
- ✅ **Labels** : `aria-label` sur tous les boutons et inputs
- ✅ **Focus management** : focus automatique sur première carte résultat
- ✅ **Taille police** : ajustable de 0.8x à 1.5x (rem)
- ✅ **Contraste** : mode contraste élevé + classe `.contrast-more`
- ✅ **Clavier** : navigation Tab, Enter pour valider
- ✅ **TTS** : lecture vocale de l'itinéraire
- ✅ **prefers-contrast** : détection automatique

### Vérification
Utiliser **axe DevTools** pour audit automatique :
```bash
npx @axe-core/cli http://localhost:4200
```

## 🎨 Design

- Palette couleurs **SBB officielle** (rouge #ec0000)
- **Ionic components** pour UI cohérente
- **Mode sombre** supporté
- **Responsive** : mobile-first
- Icônes de transport (via Ionic Icons en remplacement des icônes SBB obsolètes)

## 📁 Structure

```
src/
├── app/
│   ├── components/         # Composants réutilisables
│   │   └── sbb-mode-icon/ # Icônes transport
│   ├── pages/             # Pages de l'app
│   │   ├── search-page/
│   │   ├── result-page/
│   │   ├── connection-details/
│   │   ├── onboard/
│   │   └── settings/
│   ├── services/          # Services métier
│   │   ├── api/
│   │   ├── disruptions/
│   │   ├── notifications/
│   │   ├── i18n/
│   │   └── storage/
│   ├── utils/             # Fonctions utilitaires
│   ├── pipes/             # Pipes personnalisés
│   ├── interfaces/        # Types TypeScript
│   └── shared/            # Constantes partagées
├── i18n/                  # Fichiers de traduction
└── theme/                 # Styles globaux
```

## 🔄 CI/CD

### GitHub Actions
Workflow automatique sur push/PR :
1. `npm ci` - Installation dépendances
2. `npm run build --prod` - Build production
3. `npm test` - Tests unitaires
4. `npx playwright test` - Tests E2E
5. Upload artifacts (dist/, coverage/, playwright-report/)

### Artefacts
- **dist/** : build de production
- **coverage/** : rapports de couverture
- **playwright-report/** : rapports E2E

## 📝 Développement

### Services principaux

#### ApiService
- `completion(term, signal?)` : autocomplétion gares
- `route(params)` : recherche itinéraires

#### DisruptionsService
- `startMonitoring(params)` : lance le polling
- `stopMonitoring()` : arrête le polling
- `disruptionAlert$` : observable des alertes

#### NotificationsService
- `requestPermission()` : demande permissions
- `showNotification(title, body, data?)` : affiche notification avec deep-link

#### SettingsService
- `getSettings()` : récupère les préférences
- `updateAlertPrefs(prefs)` : met à jour alertes
- `updateUiPrefs(prefs)` : met à jour UI (applique immédiatement)

#### I18nService
- `t(key, fallback?)` : traduit une clé
- `setLanguage(lang)` : change la langue

### Utils

#### icon.util
- `iconKeyFromLeg(leg)` : détermine l'icône pour un trajet
- `getLegCode(leg)` : extrait le code ligne
- `getLineType(leg)` : type de transport

#### date-time.util
- `formatDate(date)` : format dd.MM.yyyy
- `formatTime(date)` : format HH:mm
- `formatDuration(minutes)` : format Xh Ymin
- `getDurationMinutes(start, end)` : durée en minutes

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est un exemple éducatif utilisant l'API publique CFF.

## 🆘 Support

Pour toute question :
- Ouvrir une issue sur GitHub
- Consulter la documentation API : https://timetable.search.ch/api/help

## 🙏 Remerciements

- **SBB CFF FFS** pour l'API publique
- **search.ch** pour l'hébergement de l'API
- **Angular** et **Ionic** pour les frameworks
- Communauté open-source

---

Développé avec ❤️ pour les utilisateurs des transports publics suisses
