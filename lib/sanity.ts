import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

type SanityImageSource = any;

export const client = createClient({
  projectId: 'df7iwkkw',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-15',
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

const AGENDA_QUERY = `*[(_type == "agendaEvent" || (_type == "article" && (count(agendaDates) > 0 || defined(agendaDate)))) && archived != true && !(_id in path("drafts.**"))] {
  _id, _type, contentType, title, archived, agendaDates, agendaDate, agendaTime, agendaBadge,
  startDate, badge, time,
  "description": select(_type == "agendaEvent" => description, excerpt),
  "image": coalesce(image.asset->url, coverImage.asset->url),
  "articleSlug": select(_type == "article" && coalesce(contentType, "article") != "event" => slug.current, articleRef->slug.current)
}`;

export const queries = {
  activities: `*[_type == "activity" && !(_id in path('drafts.**'))] | order(order asc, title asc) {
    id, title, category, description, pedagogie, experience, logistique, price,
    "prices": prices[]{ _key, label, value, pricingSection, duration, details },
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    isTideDependent, bookingUrl, duration, minAge, accroche, planningNote,
    "actions": {
      "stage": actions.stage { ..., "template": template->{ modalTitle, content } },
      "reservation": actions.reservation { ..., "template": template->{ modalTitle, content } },
      "rental": actions.rental { ..., "template": template->{ modalTitle, content } }
    }
  }`,
  settings: `*[_type == "spotSettings"][0] {
    spotStatus, statusMessage,
    charStatus, charMessage, charTags,
    marcheStatus, marcheMessage, marcheTags,
    nautiqueStatus, nautiqueMessage, nautiqueTags,
    stageStatuses[] { stageKey, status, message },
    lastPublishedAt
  }`,
  stageDefinitions: `*[_type == "stageDefinition" && isActive == true] | order(order asc) {
    _id,
    "key": key.current,
    label, shortLabel, vigieGroupId, order, isActive, planningType, color
  }`,
  news: `*[_type == "news"] | order(publishedAt desc)[0...30] {
    _id, title, category, content, externalLink, date, publishedAt
  }`,
  fleet: `*[_type == "fleetItem"] {
    id, name, subtitle, description, "gallery": gallery[].asset->url, stats, crew
  }`,
  plannings: `*[_type == "weeklyPlanning"] | order(startDate asc) {
    _id, title, startDate, endDate, isPublished,
    days[] {
      _key, name, date, isRaidDay, raidStageKey,
      stageSlots[] { _key, stageKey, time, activity, description }
    }
  }`,
  charPlannings: `*[_type == "planningCharAVoile"] | order(startDate asc) {
    _id, title, startDate, endDate,
    weeks[] {
      _key, title, startDate, endDate,
      days[] {
        _key, name, date, sessions[] { _key, time }
      }
    }
  }`,
  marchePlannings: `*[_type == "planningMarche"] | order(startDate asc) {
    _id, title, startDate, endDate,
    weeks[] {
      _key, title, startDate, endDate,
      days[] {
        _key, name, date, sessions[] { _key, time }
      }
    }
  }`,
  homeGallery: `*[_type == "homeGallery"][0] {
    title, subtitle, "images": images[].asset->url
  }`,
  merchItems: `*[_type == "merchItem"] {
    _id, name, price, description, category, badge, "image": image.asset->url
  }`,
  adminMerchItems: `*[_type == "merchItem"] | order(name asc) {
    _id, _type, name, price, description, category, badge,
    "image": image.asset->url, "imageAssetId": image.asset._ref,
    "hoverImage": hoverImage.asset->url, "hoverImageAssetId": hoverImage.asset._ref
  }`,
  occazItems: `*[_type == "occazItem"] {
    _id, name, price, condition, year, description, "image": image.asset->url
  }`,
  adminOccazItems: `*[_type == "occazItem"] | order(name asc) {
    _id, _type, name, price, condition, year, description,
    "image": image.asset->url, "imageAssetId": image.asset._ref
  }`,
  adminSignageSlides: `*[_type == "signageSlide"] | order(order asc, title asc) {
    _id, _type, title, type, "duration": coalesce(duration, 15000), "order": coalesce(order, 0), isActive,
    promoContent { tag, title, description, showQrCode, "image": image.asset->url, "imageAssetId": image.asset._ref },
    partnersContent { title, list[] { _key, name, "logo": logo.asset->url, "logoAssetId": logo.asset._ref } },
    infoContent { title, message, category }
  }`,
  infoMessages: `*[_type == "infoMessage" && (!defined(expiresAt) || expiresAt > now())] | order(isPinned desc, publishedAt desc)[0...50] {
    _id, title, content, category, isPinned, targetGroups, externalLink, publishedAt, expiresAt
  }`,
  adminInfoMessages: `*[_type == "infoMessage"] | order(isPinned desc, publishedAt desc)[0...100] {
    _id, title, content, category, isPinned, targetGroups, externalLink, publishedAt, expiresAt
  }`,
  vibeMessages: `*[_type == "vibeMessage" && isActive == true] | order(priority desc) {
    _id, title, subtitle, conditionType, minWind, maxWind, windDirection, priority, isActive
  }`,
  clubPage: `*[_type == "clubPage"][0] {
    "hero": { "title": hero.title, "subtitle": hero.subtitle, "description": hero.description, "heroImage": hero.heroImage.asset->url },
    heroStats, identityTitle, values,
    storytelling[] { chapterLabel, title, highlightText, quote, isFinalChapter, "image": image.asset->url },
    storytellingCta,
    "team": team { tag, title, "boardMembers": boardMembers[] { name, role, image }, caMembers, "proTeam": proTeam[] { name, role, image } },
    "site": site { title, description, facilities, imageCaption, imageSublabel, "image": image.asset->url },
    "fleet": fleet { title, "items": items[] { name, subtitle, description, crew, stats, "gallery": gallery[].asset->url } },
    "agenda": agenda { title, highlightText, description, volunteering, "events": ${AGENDA_QUERY} },
    "souvenirs": souvenirs { title, highlightText, description, "items": items[] { "image": image.asset->url, title, date, decade } },
    cta
  }`,
  adminAgendaEvents: `*[_type == "agendaEvent"] | order(startDate desc) {
    _id, title, startDate, badge, time, description,
    "image": image.asset->url,
    "articleSlug": articleRef->slug.current
  }`,
  homeAgenda: AGENDA_QUERY,
  adminEditorial: `*[_type in ["article", "agendaEvent"] && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, startDate) desc) {
    _id, _type, title, contentType, archived, "slug": slug.current, category, publishedAt,
    agendaDates, agendaDate, agendaTime, agendaBadge, startDate, time, badge,
    "coverImage": coalesce(coverImage.asset->url, image.asset->url)
  }`,
  articles: `*[_type == "article" && coalesce(contentType, "article") != "event" && archived != true && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id, title, "slug": slug.current, category, publishedAt, excerpt,
    "coverImage": coverImage.asset->url
  }`,
  articleBySlug: `*[_type == "article" && coalesce(contentType, "article") != "event" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id, title, "slug": slug.current, category, publishedAt, excerpt,
    "coverImage": coverImage.asset->url,
    body[] {
      ...,
      _type == "image" => { ..., "url": asset->url }
    }
  }`,
  homePage: `*[_type == "homePage"][0] {
    "hero": { "title": heroTitle, "subtitle": heroSubtitle, "images": heroImages[].asset->url, "videoUrl": heroVideoUrl, "spotImage": spotImage.asset->url },
    "spirit": { "title": spiritTitle, "message": spiritMessage, "description": spiritDescription, "cards": spiritCards[] { tag, title, description, "image": image.asset->url, link, buttonText, iconName, colorTheme } },
    "partners": partners[] { name, "logo": logo.asset->url, link },
    "focusCards": focusCards[] {
      cardType, themeColor, iconName, title, highlightSuffix, tagline, subTagline, description,
      badgeValue, badgeLabel,
      "images": images[].asset->url,
      ctaButton, infoButton
    },
    "focusChar": focusChar { title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel, "images": images[].asset->url, ctaButton, infoButton },
    "focusGlisse": focusGlisse { title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel, "images": images[].asset->url, ctaButton, infoButton },
    "focusBienEtre": focusBienEtre { title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel, "images": images[].asset->url, ctaButton, infoButton },
    "campus": campus { tagline, titlePart1, titlePart2, compactTitle, intro, chapters[] { label, audience, title, titleSpan, proof, desc, "image": image.asset->url, link, linkLabel, themeColor } },
    "immersion": { "titlePart1": immersionTitlePart1, "titlePart2": immersionTitlePart2, "cards": immersionCards[] { titlePart1, titlePart2, description, "image": image.asset->url, link, buttonText, iconName, iconColor } }
  }`,

  groupsPage: `*[_type == "groupsPage"][0] {
    pageBuilder[]{
      _type,
      // Shared fields
      colorTheme,
      
      _type == "heroSection" => {
        title,
        subtitle, "heroImage": heroImage.asset->url, stats, servicesText
      },
      _type == 'twoColumnsFeature' => {
        anchorId, tag, titlePart1, titlePart2, description, features, buttonText, buttonLink, "mainImage": mainImage.asset->url, sideCard { "image": image.asset->url, title, description, bottomText }
      },
      _type == 'gridShowcase' => {
        anchorId, tag, titlePart1, titlePart2, cards[] { title, description, iconName, colorTheme, points, buttonText, buttonLink }
      },
      _type == 'ctaContact' => {
        tag, titlePart1, titlePart2, "bgImage": bgImage.asset->url, primaryButton, secondaryButton
      }
    }
  }`,
  activitiesPage: `*[_type == "activitiesPage"][0] {
    hero { title, subtitle, "heroImage": heroImage.asset->url },
    yearlyClub {
        intro,
        poles[]-> | order(order asc) {
            title,
            icon,
            activities[]-> {
                title, category, badge, age, price, schedule, description, icon, colorClass
            }
        },
        weatherInfo,
        footer {
            title, description, buttonText, buttonPhone, "bgImage": bgImage.asset->url
        }
    }
  }`,
  infosPage: `*[_type == "infosPage"][0] {
    heroTitle, heroSubtitle, address, phone, email,
    "documents": documents[]{ title, description, category, "url": file.asset->url },
    "pricing": pricing {
      eyebrow, title, "pdfUrl": pricingFile.asset->url,
      "stages": stages { label, note, secondWeekDiscountPercent, rows[] { activity, ages, price1 } },
      "courses": courses { label },
      "locations": locations { label },
      footerNote
    },
    "catalogActivities": *[_type == "activity" && !(_id in path('drafts.**'))] | order(order asc, title asc) {
      id, title, duration, pricingMode,
      "prices": prices[defined(label) && label != "" && defined(value) && value != ""]{ _key, label, value, pricingSection, duration, details }
    },
    "catalogStages": *[_type == "schoolPage" && !(_id in path('drafts.**'))][0].stages[]{
      id, officialName, age, price, "pricingTiers": pricingTiers[]{ label, value }
    }
  }`,
  leSpotPage: `*[_type == "leSpotPage"][0] {
    hero { title, subtitle, description, "heroImage": heroImage.asset->url }
  }`,
  naturePage: `*[_type == "naturePage"][0] {
    hero { title, subtitle, description, "heroImage": heroImage.asset->url },
    estran { tag, title, description, marnageValue, marnageLabel, cards[] { title, description, iconName, color } },
    "habitants": { "tag": habitants.tag, "title": habitants.title, "subtitle": habitants.subtitle, "list": *[_type == "natureEntity"] | order(name asc) { name, scientificName, "image": image.asset->url, tags, tagColor, description, category } },
    peche { tag, title, sizes[] { label, value }, toolsDescription, securityTitle, securityDescription, securityTip },
    observations[] { id, title, type, description, tip, coordinates { lat, lng }, "images": images[].asset->url },
    exploration { tag, title, description, cards[] { title, subtitle, description, "image": cardImage.asset->url, features, buttonText, buttonLink } }
  }`,
  schoolPage: `*[_type == "schoolPage"][0]{
    ..., intro, hero { ..., "image": image.asset->url }, heroBadges,
    stages[] { ..., "image": image.asset->url },
    proFormations[] { ..., "image": image.asset->url },
    ecoleAnnee { sectionTitle, sectionSubtitle, sectionDescription, groups[] { title, age, jour, activite, detail, price, priceSuffix, accentColor, color, iconName } }
  }`,
  schoolStages: `*[_type == "schoolPage"][0]{
    pinnedCampaignKey, campaigns[] { ..., "imageUrl": image.asset->url },
    "stages": stages[] {
      _key, id, officialName, age, price, hook, description, logistique, registrationUrl, bgColor, showOnHome,
      "pricingTiers": pricingTiers[]{ label, value },
      "image": image.asset->url
    }
  }`,
  dicoWords: `*[_type == "dicoWord"] | order(word asc) {
    _id, word, slug, pronunciation, childQuote, parentFear, reality, quizAnswers, correctAnswerIdx
  }`,
  // Page Char à voile
  charAVoilePage: `*[_type == "charAVoilePage"][0] {
    seo, hero, media, practicalInfos, faq, weatherNote
  }`,
  // Sessions char à voile avec comptage des réservations confirmées
  charSessions: `*[_type == "charSession"] | order(date asc) {
    _id, _type, date, heureDebut, heureFin, capaciteMax, notes, actif,
    "placesReservees": coalesce(math::sum(*[_type == "charBooking" && session._ref == ^._id && statut == "confirme"].nbPlaces), 0),
    "reservationsEnAttente": count(*[_type == "charBooking" && session._ref == ^._id && statut in ["a_valider", "liste_attente"]]),
    "reservationsAValider": count(*[_type == "charBooking" && session._ref == ^._id && statut == "a_valider"]),
    "reservationsListeAttente": count(*[_type == "charBooking" && session._ref == ^._id && statut == "liste_attente"]),
    "reservationsASuivre": *[_type == "charBooking" && session._ref == ^._id && statut in ["a_valider", "liste_attente"]] | order(_createdAt asc) {_id, clientNom, nbPlaces, statut, motifSuivi},
    "reservationTodos": *[_type == "charBooking" && session._ref == ^._id && defined(todo) && todo != "" && todoDone != true && statut != "annule"]{_id, clientNom, nbPlaces, todo}
  }`,
  // Sessions publiques uniquement (actif == true et date >= aujourd'hui)
  charSessionsPublic: `*[_type == "charSession" && actif != false && date >= $today] | order(date asc) {
    _id, date, heureDebut, heureFin, capaciteMax, actif,
    "placesReservees": coalesce(math::sum(*[_type == "charBooking" && session._ref == ^._id && statut == "confirme"].nbPlaces), 0)
  }`,
  // Bookings d'une session
  charBookingsBySession: `*[_type == "charBooking" && session._ref == $sessionId] | order(_createdAt asc) {
    _id, _type, _createdAt, clientNom, clientTel, nbPlaces, statut, motifSuivi, notes, todo, todoDone
  }`,
  // Tous les bookings (pour admin)
  charBookings: `*[_type == "charBooking"] | order(_createdAt desc) {
    _id, _type, _createdAt, clientNom, clientTel, nbPlaces, statut, notes,
    "session": session->{ _id, date, heureDebut, heureFin }
  }`,
};

