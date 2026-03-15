import { client, queries } from '../../lib/sanity';
import HomePageClient from '../../components/HomePageClient';

// Add revalidate inside the server component to enable ISR optionally
export const revalidate = 60; // revalidate every 60 seconds

export default async function Page() {
    // SSR Fetching
    const [
        homePageData,
        dicoWords,
        homeGallery,
        infoMessages,
        upcomingEvents
    ] = await Promise.all([
        client.fetch(queries.homePage),
        client.fetch(queries.dicoWords),
        client.fetch(queries.homeGallery),
        client.fetch(queries.infoMessages),
        client.fetch(queries.homeAgenda),
    ]);

    return (
        <HomePageClient 
            homePageData={homePageData} 
            dicoWords={dicoWords} 
            homeGallery={homeGallery} 
            infoMessages={infoMessages} 
            upcomingEvents={upcomingEvents || []}
        />
    );
}
