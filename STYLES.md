# Freelio — Sistema de Diseño

## REFERENCIA VISUAL

La referencia principal es **Composer (composer.trade)**: fondo claro neutro (`#f7f7f7`) con bloques geométricos de colores saturados superpuestos como elemento decorativo, tipografía bold y condensada con letter-spacing negativo en tamaños grandes, componentes minimalistas y funcionales, alto contraste texto/fondo. Estética "algorithmic canvas". Referencias secundarias: Rive.app, Linear.app, Framer.

Freelio adopta esta estética orientada a creativos freelance: más expresiva y cálida que una fintech, manteniendo claridad y profesionalismo.

---

## TOKENS CSS

### Tailwind v4 (`@theme`)

```css
@theme {
  --color-canvas-white: #f7f7f7;
  --color-ash-gray: #e5e7eb;
  --color-midnight-ink: #000000;
  --color-graphite: #101516;
  --color-steel-gray: #bec6cc;
  --color-composer-blue: #1871da;
  --color-emerald-green: #31805a;
  --color-bubblegum-pink: #ffb4ed;
  --color-vivid-green: #1ec072;
  --color-hot-pink: #f6609f;
  --color-cadet-blue: #1f86ff;
  --color-sunny-yellow: #ffbb38;
  --color-sunset-orange: #ff5500;
  --color-action-red: #c60808;

  --font-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;

  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.224px;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: 0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.24px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: 0.225px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.96px;

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-40: 160px;

  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  --shadow-subtle: rgba(24, 113, 218, 0.25) 0px 1px 2px 0px;
  --shadow-card: rgba(0,0,0,0.01) 45px 68px 33px 0px, rgba(0,0,0,0.02) 25px 38px 27px 0px, rgba(0,0,0,0.03) 11px 17px 20px 0px, rgba(0,0,0,0.04) 3px 4px 11px 0px;
  --shadow-dark: rgba(31,33,35,0.03) 54px 82px 39px 0px, rgba(31,33,35,0.09) 31px 46px 33px 0px, rgba(31,33,35,0.15) 14px 20px 24px 0px, rgba(31,33,35,0.18) 3px 5px 13px 0px;
}
```

### Variables CSS globales (`:root`)

```css
:root {
  --color-canvas-white: #f7f7f7;
  --color-ash-gray: #e5e7eb;
  --color-midnight-ink: #000000;
  --color-graphite: #101516;
  --color-steel-gray: #bec6cc;
  --color-composer-blue: #1871da;
  --color-emerald-green: #31805a;
  --color-bubblegum-pink: #ffb4ed;
  --color-vivid-green: #1ec072;
  --color-hot-pink: #f6609f;
  --gradient-hot-pink: linear-gradient(90deg, rgb(246, 96, 159) 20px, rgba(0,0,0,0) 1%);
  --color-cadet-blue: #1f86ff;
  --color-sunny-yellow: #ffbb38;
  --color-sunset-orange: #ff5500;
  --color-action-red: #c60808;

  --font-display: 'Neue Haas Grotesk Display', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --page-max-width: 1200px;
  --section-gap: 32px;
  --card-padding: 16px;

  --surface-page: #f7f7f7;
  --surface-card: #ffffff;
  --surface-dark: #262d2f;
  --surface-accent: #31805a;

  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  --shadow-subtle: rgba(24, 113, 218, 0.25) 0px 1px 2px 0px;
  --shadow-card: rgba(0,0,0,0.01) 45px 68px 33px 0px, rgba(0,0,0,0.02) 25px 38px 27px 0px, rgba(0,0,0,0.03) 11px 17px 20px 0px, rgba(0,0,0,0.04) 3px 4px 11px 0px;
  --shadow-dark: rgba(31,33,35,0.03) 54px 82px 39px 0px, rgba(31,33,35,0.09) 31px 46px 33px 0px, rgba(31,33,35,0.15) 14px 20px 24px 0px, rgba(31,33,35,0.18) 3px 5px 13px 0px;
}
```

---

## FILOSOFÍA

1. **Variables, nunca valores hardcodeados** — todo color, spacing y radius usa variables CSS
2. **Componentes simples** — pocas clases, semánticas, sin anidado excesivo
3. **Colores saturados = decorativos** — nunca para texto extenso, solo para bloques de fondo
4. **Tipografía con jerarquía clara** — `--font-display` para headings, `--font-body` para todo lo demás
5. **Sin medidas exactas en Tailwind** — usar variables del sistema (`var(--spacing-4)`, no `p-[16px]`)

---

## TIPOGRAFÍA

| Rol | Font | Tamaño | Line height | Letter spacing |
|-----|------|--------|-------------|----------------|
| Display | Neue Haas Grotesk Display | 56px | 1.11 | -0.96px |
| Heading | Neue Haas Grotesk Display | 36px | 1.25 | 0.225px |
| Subheading | Neue Haas Grotesk Display | 24px | 1.33 | 0.24px |
| Body | Inter | 16px | 1.43 | 0.4px |
| Body SM | Inter | 14px | 1.43 | 0.224px |

---

## COLORES — USO CORRECTO

| Color | Token | Uso |
|-------|-------|-----|
| Canvas White | `--color-canvas-white` | Fondo de página |
| Midnight Ink | `--color-midnight-ink` | Texto principal, headings |
| Ash Gray | `--color-ash-gray` | Bordes, divisores |
| Steel Gray | `--color-steel-gray` | Texto secundario, placeholders |
| Composer Blue | `--color-composer-blue` | CTA principal, links activos |
| Sunset Orange | `--color-sunset-orange` | Botones de acción secundaria |
| Vivid Green | `--color-vivid-green` | Bloques decorativos, estado activo |
| Bubblegum Pink | `--color-bubblegum-pink` | Bloques decorativos |
| Sunny Yellow | `--color-sunny-yellow` | Bloques decorativos, alertas suaves |
| Cadet Blue | `--color-cadet-blue` | Bloques decorativos |
| Hot Pink | `--color-hot-pink` | Bloques decorativos, accents |
| Emerald Green | `--color-emerald-green` | Superficies accent, estado "activo" |

---

## CLASES CSS BASE

Copia este bloque completo en `src/styles/global.css`:

```css
/* Botones */
.btn-primary {
  background: var(--color-composer-blue);
  color: white;
  border-radius: var(--radius-full);
  padding: var(--spacing-4) var(--spacing-8);  /* 16px 32px */
  font-family: var(--font-display);
  font-weight: var(--font-weight-medium);
  font-size: var(--text-body);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-subtle);
}

.btn-action {
  background: var(--color-sunset-orange);
  color: var(--color-midnight-ink);
  border-radius: var(--radius-sm);  /* sharp corners */
  padding: var(--spacing-4) var(--spacing-3);  /* 16px 12px */
  font-family: var(--font-display);
  font-weight: var(--font-weight-regular);
  font-size: var(--text-body);
  border: none;
  cursor: pointer;
}

.btn-ghost {
  background: transparent;
  color: var(--color-midnight-ink);
  border: none;
  padding: 0;
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
  font-size: var(--text-body);
  cursor: pointer;
}

.btn-dark {
  background: var(--color-midnight-ink);
  color: white;
  border-radius: var(--radius-full);
  padding: var(--spacing-4) var(--spacing-6);  /* 16px 24px */
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
}

/* Cards */
.card {
  background: var(--surface-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--card-padding);
}

.card-dark {
  background: var(--surface-dark);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dark);
  padding: var(--card-padding);
}

/* Badges */
.badge-active {
  background: color-mix(in srgb, var(--color-vivid-green) 15%, transparent);
  color: var(--color-emerald-green);
  border-radius: var(--radius-full);
  padding: 2px var(--spacing-2);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
}

.badge-pending {
  background: color-mix(in srgb, var(--color-sunny-yellow) 25%, transparent);
  color: #854F0B;
  border-radius: var(--radius-full);
  padding: 2px var(--spacing-2);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
}

.badge-inactive {
  background: var(--color-ash-gray);
  color: var(--color-steel-gray);
  border-radius: var(--radius-full);
  padding: 2px var(--spacing-2);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
}

/* Input */
.input {
  background: white;
  border: 1px solid var(--color-ash-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--color-midnight-ink);
  width: 100%;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.input:focus {
  border-color: var(--color-composer-blue);
  box-shadow: var(--shadow-subtle);
}

.input::placeholder {
  color: var(--color-steel-gray);
}

/* Color swatch (brand kit) */
.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 2px solid white;
  box-shadow: var(--shadow-subtle);
  cursor: pointer;
  transition: transform 0.1s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

/* Bloque decorativo geométrico */
.deco-block {
  position: absolute;
  border-radius: 0;  /* sharp corners — característica del estilo */
  z-index: 0;
  pointer-events: none;
}
```

---

## LAYOUT

```
Sidebar (desktop): 240px fijo
  bg: var(--color-midnight-ink)
  text: white
  Logo: font-display, weight 700, blanco
  Nav links: font-body, weight 500, color steel-gray
  Link activo: color blanco + borde izquierdo 3px vivid-green

Contenido principal: flex-1
  bg: var(--surface-page)
  padding: var(--spacing-8)

Header mobile: 60px
  bg: var(--surface-card)
  border-bottom: 1px var(--color-ash-gray)

Max width: var(--page-max-width) — 1200px
Gap entre secciones: var(--section-gap) — 32px
```

---

## DO'S Y DON'TS

### ✅ Hacer
- Variables CSS para todos los valores de diseño
- `--font-display` para headings, `--font-body` para todo lo demás
- Letter-spacing negativo en headings 36px+
- Bloques geométricos de colores saturados como decoración
- Botones pill para CTAs, sharp corners para botones de acción secundaria
- Alto contraste: midnight ink sobre canvas white

### ❌ No hacer
- Valores hardcodeados de color, spacing o radius
- Clases Tailwind con valores exactos (`p-[16px]`, `text-[#000]`)
- Colores saturados para texto extenso
- Más de 3 niveles de anidado en componentes
- `--font-display` e `--font-body` mezclados en el mismo elemento
- Fondos oscuros en secciones enteras (solo sidebar y dark cards)