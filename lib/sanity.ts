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

export const queries = {
  activities: `*[_type == "activity" && !(_id in path('drafts.**'))] | order(order asc, title asc) {
    id, title, category, description, pedagogie, experience, logistique, price,
    "prices": prices[]{ label, value },
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    isTideDependent, bookingUrl, duration, minAge, accroche, planningNote, actions
  }`,
  settings: `*[_type == "spotSettings"][0] {
    spotStatus, statusMessage,
    charStatus, charMessage, charTags,
    marcheStatus, marcheMessage, marcheTags,
    nautiqueStatus, nautiqueMessage, nautiqueTags,
    stagesMiniMoussesStatus, stagesMiniMoussesMessage,
    stagesMoussaillonsStatus, stagesMoussaillonsMessage,
    stagesInitiationStatus, stagesInitiationMessage,
    stagesPerfStatus, stagesPerfMessage,
    lastPublishedAt
  }`,
  news: `*[_type == "news"] | order(publishedAt desc)[0...30] {
    _id, title, category, content, externalLink, date, publishedAt
  }`,
  team: `*[_type == "teamMember"] {
    name, role, category, diplome, "image": image.asset->url
  }`,
  fleet: `*[_type == "fleetItem"] {
    id, name, subtitle, description, "gallery": gallery[].asset->url, stats, crew
  }`,
  plannings: `*[_type == "weeklyPlanning"] | order(startDate asc) {
    _id, title, startDate, endDate,
    days[] {
      _key, name, date, isRaidDay, raidTarget,
      miniMousses { time, activity, description },
      mousses { time, activity, description },
      initiation, perfectionnement
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
  occazItems: `*[_type == "occazItem"] {
    _id, name, price, condition, year, description, "image": image.asset->url
  }`,
  infoMessages: `*[_type == "infoMessage" && (!defined(expiresAt) || expiresAt > now())] | order(isPinned desc, publishedAt desc)[0...50] {
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
    "agenda": agenda { title, highlightText, description, volunteering, events[] { title, startDate, badge, time, description, "image": image.asset->url } },
    "souvenirs": souvenirs { title, highlightText, description, "items": items[] { "image": image.asset->url, title, date, decade } },
    cta
  }`,
  homePage: `*[_type == "homePage"][0] {
    "hero": { "title": heroTitle, "subtitle": heroSubtitle, "images": heroImages[].asset->url, "videoUrl": heroVideoUrl, "spotImage": spotImage.asset->url },
    "spirit": { "title": spiritTitle, "message": spiritMessage, "description": spiritDescription, "cards": spiritCards[] { tag, title, description, "image": image.asset->url, link, buttonText, iconName, colorTheme } },
    "partners": partners[] { name, "logo": logo.asset->url, link },
    "focusChar": focusChar { title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel, "images": images[].asset->url, ctaButton, infoButton },
    "focusGlisse": focusGlisse { title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel, "images": images[].asset->url, ctaButton, infoButton },
    "focusBienEtre": focusBienEtre { title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel, "images": images[].asset->url, ctaButton, infoButton },
    "campus": campus { tagline, titlePart1, titlePart2, chapters[] { label, title, titleSpan, proof, desc, "image": image.asset->url, link, linkLabel, themeColor } }
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
        tag, titlePart1, titlePart2, description, features, buttonText, buttonLink, "mainImage": mainImage.asset->url, sideCard { "image": image.asset->url, title, description, bottomText }
      },
      _type == 'gridShowcase' => {
        tag, titlePart1, titlePart2, cards[] { title, description, iconName, colorTheme, points, buttonText, buttonLink }
      },
      _type == 'ctaContact' => {
        tag, titlePart1, titlePart2, "bgImage": bgImage.asset->url, primaryButton, secondaryButton
      }
    }
  }`,
  activitiesPage: `*[_type == "activitiesPage"][0] {
    hero { title, subtitle, "heroImage": heroImage.asset->url }
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
    ..., intro, hero { ..., "image": image.asset->url }, heroBadges, stages[] { ..., "image": image.asset->url }
  }`,
  dicoWords: `*[_type == "dicoWord"] | order(word asc) {
    _id, word, slug, pronunciation, childQuote, parentFear, reality, quizAnswers, correctAnswerIdx
  }`,
};
