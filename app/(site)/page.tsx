import { client, queries } from '../../lib/sanity';
import { expandAgendaEvents } from '@/lib/editorial';
import HomePageClient from '../../components/HomePageClient';

export const metadata = {
    title: 'CNC Coutainville — Club Nautique & École de Voile',
    description: 'Club Nautique de Coutainville depuis 1978 : stages voile, char à voile, wingfoil, kitesurf et marche aquatique sur la côte normande. École labellisée FFVoile.',
    openGraph: {
        title: 'CNC Coutainville — Club Nautique & École de Voile',
        description: 'Club Nautique de Coutainville depuis 1978 : stages voile, char à voile, wingfoil, kitesurf et marche aquatique sur la côte normande.',
        url: 'https://cnccoutainville.fr',
        siteName: 'CNC Coutainville',
        locale: 'fr_FR',
        type: 'website',
    },
};

export const revalidate = 60;

export default async function Page() {
    // SSR Fetching
    const [
        homePageData,
        homeGallery,
        infoMessages,
        upcomingEvents,
        schoolStages
    ] = await Promise.all([
        client.fetch(queries.homePage),
        client.fetch(queries.homeGallery),
        client.fetch(queries.infoMessages),
        client.fetch(queries.homeAgenda),
        client.fetch(queries.schoolStages).catch(() => null),
    ]);

    return (
        <HomePageClient 
            homePageData={homePageData} 
            homeGallery={homeGallery} 
            infoMessages={infoMessages} 
            upcomingEvents={expandAgendaEvents(upcomingEvents || [])}
            schoolStages={schoolStages?.stages || []}
            stageCampaigns={schoolStages?.campaigns || []}
            pinnedCampaignKey={schoolStages?.pinnedCampaignKey || ""}
        />
    );
}
