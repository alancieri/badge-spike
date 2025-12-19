import { Badge, BadgeTemplate } from '../types/badge';
import { BadgeCard } from './BadgeCard';
import {
  CircleTemplate,
  HexagonTemplate,
  ShieldTemplate,
  RibbonTemplate,
  CardHorizontal,
  CardMinimal,
  CardCompact,
} from './templates';

export interface BadgeRendererProps {
  /** I dati del badge da renderizzare */
  badge: Partial<Badge>;
  /** Dimensione del badge */
  size?: 'small' | 'medium' | 'large';
  /** Mostra dettagli aggiuntivi (descrizione, tags, ecc.) */
  showDetails?: boolean;
  /** Override del template salvato nel badge */
  templateOverride?: BadgeTemplate;
  /** Override del colore primario salvato nel badge */
  primaryColorOverride?: string;
}

/**
 * Componente principale per renderizzare un badge.
 *
 * Il badge può avere template e primaryColor salvati nel JSON.
 * L'applicazione host può sovrascriverli con templateOverride e primaryColorOverride.
 *
 * @example
 * // Usa template e colore dal badge
 * <BadgeRenderer badge={badge} />
 *
 * // Override del template
 * <BadgeRenderer badge={badge} templateOverride="card-compact" />
 *
 * // Override del colore (es. per adattarsi al tema dell'app)
 * <BadgeRenderer badge={badge} primaryColorOverride="#ff0000" />
 */
export function BadgeRenderer({
  badge,
  size = 'medium',
  showDetails = true,
  templateOverride,
  primaryColorOverride,
}: BadgeRendererProps) {
  // Usa override se fornito, altrimenti valore dal badge, altrimenti default
  const template: BadgeTemplate = templateOverride || badge.template || 'card';

  // Crea un badge con il colore override se fornito
  const effectiveBadge: Partial<Badge> = primaryColorOverride
    ? { ...badge, primaryColor: primaryColorOverride }
    : badge;

  switch (template) {
    case 'card-horizontal':
      return <CardHorizontal badge={effectiveBadge} size={size} showDetails={showDetails} />;
    case 'card-minimal':
      return <CardMinimal badge={effectiveBadge} size={size} />;
    case 'card-compact':
      return <CardCompact badge={effectiveBadge} size={size} showDetails={showDetails} />;
    case 'circle':
      return <CircleTemplate badge={effectiveBadge} size={size} />;
    case 'hexagon':
      return <HexagonTemplate badge={effectiveBadge} size={size} />;
    case 'shield':
      return <ShieldTemplate badge={effectiveBadge} size={size} />;
    case 'ribbon':
      return <RibbonTemplate badge={effectiveBadge} size={size} />;
    case 'card':
    default:
      return <BadgeCard badge={effectiveBadge} size={size} showDetails={showDetails} />;
  }
}
