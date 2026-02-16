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
                .title('Contenu Page Activités')
                .id('activitiesPage')
                .child(
                    S.document()
                        .schemaType('activitiesPage')
                        .documentId('activitiesPage')
                        .title('Contenu Page Activités')
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
                .title('Galerie Accueil')
                .id('homeGallery')
                .child(
                    S.document()
                        .schemaType('homeGallery')
                        .documentId('homeGallery')
                        .title('Galerie Accueil')
                ),

            S.divider(),

            // Regular document types
            ...S.documentTypeListItems().filter(
                (listItem) => !['naturePage', 'clubPage', 'groupsPage', 'activitiesPage', 'leSpotPage', 'homeGallery', 'spotSettings', 'homePage', 'infosPage'].includes(listItem.getId() || '')
            ),
        ]);
