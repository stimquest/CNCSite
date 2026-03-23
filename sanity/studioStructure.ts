import { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
    S.list()
        .title('Contenu')
        .items([
            // Singletons
            S.listItem()
                .title('Contenu Page Club')
                .id('clubPage')
                .child(
                    S.document()
                        .schemaType('clubPage')
                        .documentId('clubPage')
                        .title('Contenu Page Club')
                ),
            S.listItem()
                .title('Contenu Page Accueil')
                .id('homePage')
                .child(
                    S.document()
                        .schemaType('homePage')
                        .documentId('homePage')
                        .title('Contenu Page Accueil')
                ),
            S.listItem()
                .title('Contenu Page Infos')
                .id('infosPage')
                .child(
                    S.document()
                        .schemaType('infosPage')
                        .documentId('infosPage')
                        .title('Contenu Page Infos')
                ),
            S.listItem()
                .title('Contenu Page Groupes')
                .id('groupsPage')
                .child(
                    S.document()
                        .schemaType('groupsPage')
                        .documentId('groupsPage')
                        .title('Contenu Page Groupes')
                ),
            S.listItem()
                .title('Club à l\'année')
                .id('yearlyClubGroup')
                .child(
                    S.list()
                        .title('Gestion Club à l\'année')
                        .items([
                            S.listItem()
                                .title('Configuration Page')
                                .id('activitiesPage')
                                .child(
                                    S.document()
                                        .schemaType('activitiesPage')
                                        .documentId('activitiesPage')
                                        .title('Configuration Page')
                                ),
                            S.divider(),
                            S.listItem()
                                .title('Les Pôles')
                                .schemaType('clubPole')
                                .child(S.documentTypeList('clubPole').title('Liste des Pôles')),
                            S.listItem()
                                .title('Les Activités')
                                .schemaType('clubActivity')
                                .child(S.documentTypeList('clubActivity').title('Liste des Activités')),
                        ])
                ),
            S.listItem()
                .title('Contenu Page Le Spot')
                .id('leSpotPage')
                .child(
                    S.document()
                        .schemaType('leSpotPage')
                        .documentId('leSpotPage')
                        .title('Contenu Page Le Spot')
                ),
            S.listItem()
                .title('Contenu Page Nature')
                .id('naturePage')
                .child(
                    S.document()
                        .schemaType('naturePage')
                        .documentId('naturePage')
                        .title('Contenu Page Nature')
                ),
            S.listItem()
                .title('Contenu Page Ecole')
                .id('schoolPage')
                .child(
                    S.document()
                        .schemaType('schoolPage')
                        .documentId('schoolPage')
                        .title('Contenu Page Ecole')
                ),

            S.listItem()
                .title('Galerie Accueil')
                .id('homeGallery')
                .child(
                    S.document()
                        .schemaType('homeGallery')
                        .documentId('homeGallery')
                        .title('Galerie Accueil')
                ),

            S.divider(),

            S.listItem()
                .title('Bases de Données')
                .child(
                    S.list()
                        .title('Inventaires & Référentiels')
                        .items([
                            S.documentTypeListItem('bookingTemplate').title('Modèles de Réservation'),
                            S.documentTypeListItem('natureEntity').title('Inventaire Nature'),
                            S.documentTypeListItem('dicoWord').title('Dico des Parents'),
                            S.divider(),
                            S.documentTypeListItem('fleetItem').title('La Flotte'),
                            S.documentTypeListItem('merchItem').title('Boutique & Merch'),
                            S.documentTypeListItem('occazItem').title('Petites Annonces Occaz'),
                        ])
                ),

            S.listItem()
                .title('Config & Alertes')
                .child(
                    S.list()
                        .title('Configuration & Messages')
                        .items([
                            S.listItem()
                                .title('Statut du Spot (Cockpit)')
                                .id('spotSettings')
                                .child(
                                    S.document()
                                        .schemaType('spotSettings')
                                        .documentId('spotSettings')
                                        .title('Statut du Spot')
                                ),
                            S.documentTypeListItem('infoMessage').title('Messages Info / Alertes'),
                            S.documentTypeListItem('vibeMessage').title('Messages d\'Ambiance'),
                            S.documentTypeListItem('signageSlide').title('Écrans (Affichage Public)'),
                        ])
                ),

            S.listItem()
                .title('Programmation & Planning')
                .child(
                    S.list()
                        .title('Gestion des Plannings')
                        .items([
                            S.documentTypeListItem('weeklyPlanning').title('Planning de la Semaine'),
                            S.divider(),
                            S.documentTypeListItem('planningCharAVoile').title('Planning Char à Voile (ancien)'),
                            S.documentTypeListItem('planningMarche').title('Planning Marche Aquatique'),
                            S.divider(),
                            S.listItem()
                                .title('🏁 Char à Voile — Booking')
                                .child(
                                    S.list()
                                        .title('Char à Voile — Réservations')
                                        .items([
                                            S.documentTypeListItem('charSession')
                                                .title('Sessions')
                                                .child(
                                                    S.documentTypeList('charSession')
                                                        .title('Sessions Char à Voile')
                                                        .defaultOrdering([{ field: 'date', direction: 'asc' }])
                                                ),
                                            S.documentTypeListItem('charBooking')
                                                .title('Réservations')
                                                .child(
                                                    S.documentTypeList('charBooking')
                                                        .title('Réservations Char à Voile')
                                                        .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                                                ),
                                        ])
                                ),
                        ])
                ),

            S.listItem()
                .title('Agenda')
                .child(
                    S.documentTypeList('agendaEvent')
                        .title('Agenda')
                        .defaultOrdering([{ field: 'startDate', direction: 'asc' }])
                ),

            S.listItem()
                .title('Blog & Articles')
                .child(
                    S.documentTypeList('article')
                        .title('Blog & Articles')
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

            S.divider(),

            // Regular document types
            ...S.documentTypeListItems().filter(
                (listItem) => !['naturePage', 'clubPage', 'groupsPage', 'activitiesPage', 'leSpotPage', 'homeGallery', 'spotSettings', 'homePage', 'infosPage', 'schoolPage', 'bookingTemplate', 'natureEntity', 'dicoWord', 'fleetItem', 'merchItem', 'occazItem', 'infoMessage', 'vibeMessage', 'signageSlide', 'clubPole', 'clubActivity', 'weeklyPlanning', 'planningCharAVoile', 'planningMarche', 'article', 'agendaEvent', 'charSession', 'charBooking'].includes(listItem.getId() || '')
            ),
        ]);
