/** Disabled until requested by the operator. No network calls or third-party scripts. */
export function AdSlot() {
  if (process.env.ADS_ENABLED !== 'true') return null;
  return <aside className="ad-slot container" aria-label="Publicidade"><span>PUBLICIDADE</span></aside>;
}
