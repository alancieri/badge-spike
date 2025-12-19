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

    // Elimina la vecchia immagine prima di caricare la nuova
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

    // Elimina il file da Supabase
    if (urlToDelete) {
      await deleteBadgeIconByUrl(urlToDelete);
    }

    // Aggiorna lo state
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 6,
  };

  const fieldGroupStyle: React.CSSProperties = {
    marginBottom: 20,
  };

  return (
    <div style={{ maxWidth: 500 }}>
      {/* Slug */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Slug</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={badge.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="education_missions_10"
            disabled={disabled}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={handleAutoSlug}
            disabled={disabled || !badge.title?.default}
            style={{
              padding: '10px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            Auto
          </button>
        </div>
      </div>

      {/* Language tabs */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            gap: 4,
            borderBottom: '1px solid #e5e7eb',
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('default')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'default' ? '#2563eb' : 'transparent',
              color: activeTab === 'default' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            Default
          </button>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveTab(lang.code)}
              style={{
                padding: '8px 12px',
                backgroundColor: activeTab === lang.code ? '#2563eb' : 'transparent',
                color: activeTab === lang.code ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            Titolo {activeTab !== 'default' && `(${activeTab})`}
          </label>
          <input
            type="text"
            value={getLocalizedValue(badge.title, activeTab)}
            onChange={(e) => updateLocalizedField('title', activeTab, e.target.value)}
            placeholder={activeTab === 'default' ? 'Educator Level 1' : 'Traduzione...'}
            disabled={disabled}
            style={inputStyle}
          />
        </div>

        {/* Subtitle */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            Sottotitolo {activeTab !== 'default' && `(${activeTab})`}
          </label>
          <input
            type="text"
            value={getLocalizedValue(badge.subtitle, activeTab)}
            onChange={(e) => updateLocalizedField('subtitle', activeTab, e.target.value)}
            placeholder={activeTab === 'default' ? 'First Achievement' : 'Traduzione...'}
            disabled={disabled}
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            Descrizione {activeTab !== 'default' && `(${activeTab})`}
          </label>
          <textarea
            value={getLocalizedValue(badge.description, activeTab)}
            onChange={(e) => updateLocalizedField('description', activeTab, e.target.value)}
            placeholder={activeTab === 'default' ? 'Complete 10 educational missions.' : 'Traduzione...'}
            disabled={disabled}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
      </div>

      {/* Category */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Categoria</label>
        <select
          value={badge.category || 'education'}
          onChange={(e) => updateField('category', e.target.value as Badge['category'])}
          disabled={disabled}
          style={inputStyle}
        >
          {BADGE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Rarity */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Rarità</label>
        <select
          value={badge.rarity || 'common'}
          onChange={(e) => updateField('rarity', e.target.value as Badge['rarity'])}
          disabled={disabled}
          style={inputStyle}
        >
          {BADGE_RARITIES.map((rarity) => (
            <option key={rarity} value={rarity}>
              {RARITY_CONFIG[rarity].label}
            </option>
          ))}
        </select>
      </div>

      {/* Template */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Template</label>
        <select
          value={badge.template || 'card'}
          onChange={(e) => updateField('template', e.target.value as Badge['template'])}
          disabled={disabled}
          style={inputStyle}
        >
          {BADGE_TEMPLATES.map((template) => (
            <option key={template} value={template}>
              {TEMPLATE_CONFIG[template].label} - {TEMPLATE_CONFIG[template].description}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Color */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Colore primario</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRIMARY_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => updateField('primaryColor', color.value)}
              disabled={disabled}
              title={color.label}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: color.value,
                border:
                  badge.primaryColor === color.value
                    ? '2px solid #0f172a'
                    : '2px solid transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'transform 0.15s ease',
                boxShadow:
                  badge.primaryColor === color.value
                    ? '0 0 0 2px #fff, 0 0 0 4px #0f172a'
                    : 'none',
              }}
            />
          ))}
          {/* Custom color input */}
          <div style={{ position: 'relative' }}>
            <input
              type="color"
              value={badge.primaryColor || '#2563eb'}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              disabled={disabled}
              style={{
                width: 32,
                height: 32,
                padding: 0,
                border: '2px solid #e5e7eb',
                borderRadius: 6,
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: 'transparent',
              }}
              title="Colore personalizzato"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Tags (separati da virgola)</label>
        <input
          type="text"
          value={(badge.tags || []).join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="missions, education, starter"
          disabled={disabled}
          style={inputStyle}
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
        label="Icona Badge (Dark mode) - opzionale"
        currentUrl={badge.icon?.darkUrl}
        onUpload={(file) => handleIconUpload(file, true)}
        onClear={() => handleIconClear(true)}
        disabled={disabled}
      />
    </div>
  );
}
