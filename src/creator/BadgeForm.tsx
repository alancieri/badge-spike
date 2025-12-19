import { useState } from 'react';
import {
  Badge,
  LocalizedText,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  BADGE_CATEGORIES,
  BADGE_RARITIES,
  BADGE_TEMPLATES,
  CATEGORY_LABELS,
  RARITY_CONFIG,
  TEMPLATE_CONFIG,
  PRIMARY_COLORS,
  generateSlug,
} from '../types/badge';
import { ImageUploader } from './ImageUploader';
import { uploadBadgeIcon, deleteBadgeIconByUrl } from '../services/bucketStorage';

interface BadgeFormProps {
  badge: Partial<Badge>;
  onChange: (badge: Partial<Badge>) => void;
  badgeId: string;
  disabled?: boolean;
}

export function BadgeForm({ badge, onChange, badgeId, disabled = false }: BadgeFormProps) {
  const [activeTab, setActiveTab] = useState<'default' | SupportedLanguage>('default');

  const updateField = <K extends keyof Badge>(field: K, value: Badge[K]) => {
    onChange({ ...badge, [field]: value });
  };

  const updateLocalizedField = (
    field: 'title' | 'subtitle' | 'description',
    lang: 'default' | SupportedLanguage,
    value: string
  ) => {
    const current = badge[field] || { default: '' };
    onChange({
      ...badge,
      [field]: { ...current, [lang]: value },
    });
  };

  const getLocalizedValue = (
    field: LocalizedText | undefined,
    lang: 'default' | SupportedLanguage
  ): string => {
    if (!field) return '';
    return field[lang] || '';
  };

  const handleAutoSlug = () => {
    const title = badge.title?.default || '';
    if (title) {
      updateField('slug', generateSlug(title));
    }
  };

  const handleIconUpload = async (file: File, isDark: boolean) => {
    const currentIcon = badge.icon || { url: '' };

    const oldUrl = isDark ? currentIcon.darkUrl : currentIcon.url;
    if (oldUrl) {
      await deleteBadgeIconByUrl(oldUrl);
    }

    const url = await uploadBadgeIcon(file, badgeId, isDark);
    if (isDark) {
      updateField('icon', { ...currentIcon, darkUrl: url });
    } else {
      updateField('icon', { ...currentIcon, url });
    }
  };

  const handleIconClear = async (isDark: boolean) => {
    const currentIcon = badge.icon || { url: '' };
    const urlToDelete = isDark ? currentIcon.darkUrl : currentIcon.url;

    if (urlToDelete) {
      await deleteBadgeIconByUrl(urlToDelete);
    }

    if (isDark) {
      updateField('icon', { ...currentIcon, darkUrl: undefined });
    } else {
      updateField('icon', { ...currentIcon, url: '' });
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    updateField('tags', tags);
  };

  const inputClasses = `
    w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  return (
    <div className="max-w-md space-y-6">
      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Slug
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={badge.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="education_missions_10"
            disabled={disabled}
            className={`${inputClasses} flex-1`}
          />
          <button
            type="button"
            onClick={handleAutoSlug}
            disabled={disabled || !badge.title?.default}
            className="px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Language tabs */}
      <div>
        <div className="flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('default')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'default'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Default
          </button>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveTab(lang.code)}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === lang.code
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Titolo {activeTab !== 'default' && <span className="text-gray-400">({activeTab})</span>}
          </label>
          <input
            type="text"
            value={getLocalizedValue(badge.title, activeTab)}
            onChange={(e) => updateLocalizedField('title', activeTab, e.target.value)}
            placeholder={activeTab === 'default' ? 'Educator Level 1' : 'Traduzione...'}
            disabled={disabled}
            className={inputClasses}
          />
        </div>

        {/* Subtitle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sottotitolo {activeTab !== 'default' && <span className="text-gray-400">({activeTab})</span>}
          </label>
          <input
            type="text"
            value={getLocalizedValue(badge.subtitle, activeTab)}
            onChange={(e) => updateLocalizedField('subtitle', activeTab, e.target.value)}
            placeholder={activeTab === 'default' ? 'First Achievement' : 'Traduzione...'}
            disabled={disabled}
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Descrizione {activeTab !== 'default' && <span className="text-gray-400">({activeTab})</span>}
          </label>
          <textarea
            value={getLocalizedValue(badge.description, activeTab)}
            onChange={(e) => updateLocalizedField('description', activeTab, e.target.value)}
            placeholder={activeTab === 'default' ? 'Complete 10 educational missions.' : 'Traduzione...'}
            disabled={disabled}
            rows={3}
            className={`${inputClasses} resize-y`}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Categoria
        </label>
        <select
          value={badge.category || 'education'}
          onChange={(e) => updateField('category', e.target.value as Badge['category'])}
          disabled={disabled}
          className={inputClasses}
        >
          {BADGE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Rarity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Rarità
        </label>
        <select
          value={badge.rarity || 'common'}
          onChange={(e) => updateField('rarity', e.target.value as Badge['rarity'])}
          disabled={disabled}
          className={inputClasses}
        >
          {BADGE_RARITIES.map((rarity) => (
            <option key={rarity} value={rarity}>
              {RARITY_CONFIG[rarity].label}
            </option>
          ))}
        </select>
      </div>

      {/* Template */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Template
        </label>
        <select
          value={badge.template || 'card'}
          onChange={(e) => updateField('template', e.target.value as Badge['template'])}
          disabled={disabled}
          className={inputClasses}
        >
          {BADGE_TEMPLATES.map((template) => (
            <option key={template} value={template}>
              {TEMPLATE_CONFIG[template].label} - {TEMPLATE_CONFIG[template].description}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Colore primario
        </label>
        <div className="flex gap-2 flex-wrap">
          {PRIMARY_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => updateField('primaryColor', color.value)}
              disabled={disabled}
              title={color.label}
              className={`w-8 h-8 rounded-lg transition-all duration-150 disabled:cursor-not-allowed ${
                badge.primaryColor === color.value
                  ? 'ring-2 ring-gray-900 ring-offset-2'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color.value }}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={badge.primaryColor || '#2563eb'}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              disabled={disabled}
              className="w-8 h-8 rounded-lg cursor-pointer border-2 border-gray-200 disabled:cursor-not-allowed"
              title="Colore personalizzato"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Tags <span className="font-normal text-gray-400">(separati da virgola)</span>
        </label>
        <input
          type="text"
          value={(badge.tags || []).join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="missions, education, starter"
          disabled={disabled}
          className={inputClasses}
        />
      </div>

      {/* Icon upload */}
      <ImageUploader
        label="Icona Badge"
        currentUrl={badge.icon?.url}
        onUpload={(file) => handleIconUpload(file, false)}
        onClear={() => handleIconClear(false)}
        disabled={disabled}
      />

      {/* Dark icon upload */}
      <ImageUploader
        label="Icona Badge (Dark mode)"
        hint="opzionale"
        currentUrl={badge.icon?.darkUrl}
        onUpload={(file) => handleIconUpload(file, true)}
        onClear={() => handleIconClear(true)}
        disabled={disabled}
      />
    </div>
  );
}
