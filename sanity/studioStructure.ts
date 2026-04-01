import { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
    S.list()
        .title('CNC — Studio')
        .items([

            // ─── 📄 PAGES DU SITE ──────────────────────────────────────────────
            S.listItem()
                .title('📄 Pages du Site')
                .child(
                    S.list()
                        .title('Pages du Site')
                        .items([
                            S.listItem()
                                .title('Accueil')
                                .id('homePage')
                                .child(S.document().schemaType('homePage').documentId('homePage').title('Page Accueil')),
                            S.listItem()
                                .title('Le Club')
                                .id('clubPage')
                                .child(S.document().schemaType('clubPage').documentId('clubPage').title('Page Club')),
                            S.listItem()
                                .title('Activités (structure page)')
                                .id('activitiesPage')
                                .child(S.document().schemaType('activitiesPage').documentId('activitiesPage').title('Page Activités')),
                            S.listItem()
                                .title('École de Voile')
                                .id('schoolPage')
                                .child(S.document().schemaType('schoolPage').documentId('schoolPage').title('Page École de Voile')),
                            S.listItem()
                                .title('Char à Voile (page)')
                                .id('charAVoilePage')
                                .child(S.document().schemaType('charAVoilePage').documentId('charAVoilePage').title('Page Char à Voile')),
                            S.listItem()
                                .title('Le Spot')
                                .id('leSpotPage')
                                .child(S.document().schemaType('leSpotPage').documentId('leSpotPage').title('Page Le Spot')),
                            S.listItem()
                                .title('Nature')
                                .id('naturePage')
                                .child(S.document().schemaType('naturePage').documentId('naturePage').title('Page Nature')),
                            S.listItem()
                                .title('Groupes & Séminaires')
                                .id('groupsPage')
                                .child(S.document().schemaType('groupsPage').documentId('groupsPage').title('Page Groupes & Séminaires')),
                            S.listItem()
                                .title('Infos Pratiques')
                                .id('infosPage')
                                .child(S.document().schemaType('infosPage').documentId('infosPage').title('Page Infos Pratiques')),
                            S.divider(),
                            S.listItem()
                                .title('Galerie Accueil')
                                .id('homeGallery')
                                .child(S.document().schemaType('homeGallery').documentId('homeGallery').title('Galerie Accueil')),
                        ])
                ),

            S.divider(),

            // ─── ⚓ ACTIVITÉS & RÉSERVATIONS ────────────────────────────────────
            S.listItem()
                .title('⚓ Activités & Réservations')
                .child(
                    S.list()
                        .title('Activités & Réservations')
                        .items([
                            S.documentTypeListItem('activity').title('Fiches Activités'),
                            S.documentTypeListItem('bookingTemplate').title('Modèles de Réservation'),
                        ])
                ),

            // ─── 📅 PLANNINGS ───────────────────────────────────────────────────
            S.listItem()
                .title('📅 Plannings')
                .child(
                    S.list()
                        .title('Plannings')
                        .items([
                            S.documentTypeListItem('weeklyPlanning').title('Stages — Planning Semaine'),
                            S.documentTypeListItem('planningMarche').title('Marche Aquatique'),
                            S.divider(),
                            S.listItem()
                                .title('🏁 Char — Sessions & Réservations')
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

            // ─── 📰 COMMUNICATION ───────────────────────────────────────────────
            S.listItem()
                .title('📰 Communication')
                .child(
                    S.list()
                        .title('Communication')
                        .items([
                            S.listItem()
                                .title('Blog & Articles')
                                .child(
                                    S.documentTypeList('article')
                                        .title('Blog & Articles')
                                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                ),
                            S.listItem()
                                .title('Agenda')
                                .child(
                                    S.documentTypeList('agendaEvent')
                                        .title('Agenda')
                                        .defaultOrdering([{ field: 'startDate', direction: 'asc' }])
                                ),
                            S.documentTypeListItem('infoMessage').title('La Vigie — Messages d\'alerte'),
                        ])
                ),

            // ─── 🛍️ BOUTIQUE ────────────────────────────────────────────────────
            S.listItem()
                .title('🛍️ Boutique')
                .child(
                    S.list()
                        .title('Boutique')
                        .items([
                            S.documentTypeListItem('merchItem').title('Articles'),
                            S.documentTypeListItem('occazItem').title('Occasions'),
                        ])
                ),

            S.divider(),

            // ─── ⚙️ CONFIGURATION & AVANCÉ ─────────────────────────────────────
            S.listItem()
                .title('⚙️ Configuration & Avancé')
                .child(
                    S.list()
                        .title('Configuration & Avancé')
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
                            S.documentTypeListItem('vibeMessage').title('Messages d\'Ambiance'),
                            S.documentTypeListItem('signageSlide').title('Digital Signage — Écrans TV'),
                            S.divider(),
                            S.listItem()
                                .title('Club à l\'Année')
                                .child(
                                    S.list()
                                        .title('Club à l\'Année')
                                        .items([
                                            S.listItem()
                                                .title('Configuration Page')
                                                .id('activitiesPageConfig')
                                                .child(S.document().schemaType('activitiesPage').documentId('activitiesPage').title('Configuration Page')),
                                            S.documentTypeListItem('clubPole').title('Les Pôles'),
                                            S.documentTypeListItem('clubActivity').title('Les Activités'),
                                        ])
                                ),
                            S.divider(),
                            S.listItem()
                                .title('Bases de Données')
                                .child(
                                    S.list()
                                        .title('Bases de Données')
                                        .items([
                                            S.documentTypeListItem('fleetItem').title('La Flotte'),
                                            S.documentTypeListItem('natureEntity').title('Inventaire Nature'),
                                            S.documentTypeListItem('dicoWord').title('Dico des Parents'),
                                        ])
                                ),
                        ])
                ),

        ]);
