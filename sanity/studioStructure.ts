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
                .icon(() => '⛵')
                .child(
                    S.list()
                        .title('Gestion Club à l\'année')
                        .items([
                            S.listItem()
                                .title('⚙️ Configuration Page')
                                .id('activitiesPage')
                                .child(
                                    S.document()
                                        .schemaType('activitiesPage')
                                        .documentId('activitiesPage')
                                        .title('Configuration Page')
                                ),
                            S.divider(),
                            S.listItem()
                                .title('🏗️ Les Pôles')
                                .schemaType('clubPole')
                                .child(S.documentTypeList('clubPole').title('Liste des Pôles')),
                            S.listItem()
                                .title('🎯 Les Activités')
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

            // --- NOUVEAU GROUPE : INVENTAIRES & RÉFÉRENTIELS ---
            S.listItem()
                .title('🗂️ Bases de Données')
                .icon(() => '🗄️')
                .child(
                    S.list()
                        .title('Inventaires & Référentiels')
                        .items([
                            S.documentTypeListItem('bookingTemplate').title('📝 Modèles de Réservation'),
                            S.documentTypeListItem('natureEntity').title('🌿 Inventaire Nature'),
                            S.documentTypeListItem('dicoWord').title('📖 Dico des Parents'),
                            S.divider(),
                            S.documentTypeListItem('fleetItem').title('⛵ La Flotte (Inventaire)'),
                            S.documentTypeListItem('merchItem').title('👕 Boutique & Merch'),
                            S.documentTypeListItem('occazItem').title('💰 Petites Annonces Occaz'),
                        ])
                ),

            // --- NOUVEAU GROUPE : CONFIGURATION & MESSAGES ---
            S.listItem()
                .title('⚙️ CONFIG & ALERTES')
                .icon(() => '🛠️')
                .child(
                    S.list()
                        .title('Configuration & Messages')
                        .items([
                            S.listItem()
                                .title('🚩 Statut du Spot (Cockpit)')
                                .id('spotSettings')
                                .child(
                                    S.document()
                                        .schemaType('spotSettings')
                                        .documentId('spotSettings')
                                        .title('Statut du Spot')
                                ),
                            S.documentTypeListItem('infoMessage').title('📢 Messages Info / Alertes'),
                            S.documentTypeListItem('vibeMessage').title('✨ Messages d\'Ambiance'),
                            S.documentTypeListItem('signageSlide').title('📺 Écrans (Affichage Public)'),
                        ])
                ),

            // --- NOUVEAU GROUPE : PROGRAMMATION & PLANNING ---
            S.listItem()
                .title('📅 PROGRAMMATION & PLANNING')
                .icon(() => '📅')
                .child(
                    S.list()
                        .title('Gestion des Plannings')
                        .items([
                            S.documentTypeListItem('weeklyPlanning').title('📅 Planning de la Semaine'),
                            S.divider(),
                            S.documentTypeListItem('planningCharAVoile').title('💨 Planning Char à Voile'),
                            S.documentTypeListItem('planningMarche').title('🚶 Planning Marche Aquatique'),
                        ])
                ),

            S.divider(),

            // Regular document types
            ...S.documentTypeListItems().filter(
                (listItem) => !['naturePage', 'clubPage', 'groupsPage', 'activitiesPage', 'leSpotPage', 'homeGallery', 'spotSettings', 'homePage', 'infosPage', 'schoolPage', 'bookingTemplate', 'natureEntity', 'dicoWord', 'fleetItem', 'merchItem', 'occazItem', 'infoMessage', 'vibeMessage', 'signageSlide', 'clubPole', 'clubActivity', 'weeklyPlanning', 'planningCharAVoile', 'planningMarche'].includes(listItem.getId() || '')
            ),
        ]);
