export type StageCampaign = {
  _key: string;
  title: string;
  startDate: string;
  endDate: string;
  promotionStart: string;
  enabled: boolean;
  stageKeys: string[];
  description?: string;
  registrationUrl?: string;
  image?: { _type: 'image'; asset: { _type: 'reference'; _ref: string } };
  imageUrl?: string;
};

export function selectStageCampaign(campaigns: StageCampaign[] = [], pinnedKey = '', now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && Number.isFinite(Date.parse(value));
  const eligible = campaigns.filter(c => c.enabled && validDate(c.startDate) && validDate(c.endDate) && c.startDate <= c.endDate && c.endDate >= today);
  // A manual choice can bring promotion forward, but never revive an expired campaign.
  return eligible.find(c => c._key === pinnedKey)
    || eligible.filter(c => c.promotionStart && c.promotionStart <= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0]
    || null;
}

export function campaignDates(c: StageCampaign) {
  const format = (value: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
  return `Du ${format(c.startDate)} au ${format(c.endDate)}`;
}
