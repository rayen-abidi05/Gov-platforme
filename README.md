# Gov-platforme

Pour un système de gestion des autorisations d'exportation d'huile d'olive, les statuts proposés sont les suivants :

```text
enum RequestStatus {
  DRAFT              // Brouillon
  SUBMITTED          // Soumise
  UNDER_REVIEW       // En cours d'étude
  ADDITIONAL_INFO    // Informations complémentaires demandées
  APPROVED           // Approuvée
  REJECTED           // Rejetée
  CANCELLED          // Annulée par le demandeur
  EXPORTED           // Exportation réalisée
}
```

Et pour les rôles :

```text
enum Role {
  EXPORTER
  ADMIN // Mme Nourchene est un gestionnaire métier
  DGEDA // Un autre cadre qui assiste aux réunions du comité
  OBSERVATOR // DG-EDA
  DIWAN_MEMBER // La douane
  INSTANCE // الهيئة
  MINISTER // M. le Ministre
  SUPER_ADMIN // Responsable technique de la plateforme
}
```
