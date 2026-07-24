# Gov-platforme

je propose pour un système de gestion des autorisations d'exportation d'huile d'olive, vous pouvez enrichir les statuts afin de mieux représenter le circuit administratif :

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

Et pour les rôles :

enum Role {
  EXPORTER
  ADMIN // Mme Nourchene est un gestionnaire métier
  DGEDA // un autre cadre qui asiste au reunion de la comité
  OBSERVATOR // DG-EDA
  DIWAN_MEMBER // la douane
  INSTANCE //  الهيئة
  MINISTER  // Mr le ministre
  SUPER_ADMIN // est le responsable technique de la plateforme
}
