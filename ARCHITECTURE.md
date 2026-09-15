# Web Studio Architecture

## Project Structure

```
src/
├── main.js                          # Entry point
├── core/                            # Core application logic
│   ├── app.js                       # App initialization
│   └── utils.js                     # Utility functions
├── components/                      # Reusable UI components
│   ├── button/                      # Button component
│   │   ├── button.js                # Component logic
│   │   └── button.scss              # Component styles
│   └── message/                     # Message component
│       ├── message.js               # Component logic
│       └── message.scss             # Component styles
└── styles/                          # Global styles
    ├── main.scss                    # Main SCSS entry point
    └── core/                        # Core style modules
        ├── _variables.scss          # Design variables
        ├── _base.scss               # Base styles & reset
        ├── _layout.scss             # Layout components
        └── _typography.scss         # Typography styles
```

## Component Architecture

Each component is self-contained with:
- **Logic file** (`component.js`) - Exports component functions
- **Style file** (`component.scss`) - Component-specific styles
- **Self-import** - Styles imported directly in the component JS file

### Example: Button Component

```javascript
// components/button/button.js
import { createElement } from '../../core/utils.js';
import './button.scss';

export function createButton(text, onClick) {
    const button = createElement('button', {
        textContent: text,
        className: 'btn'
    });
    
    button.addEventListener('click', onClick);
    return button;
}
```

```scss
// components/button/button.scss
@use '../../styles/core/_variables.scss' as *;

.btn {
    background: $primary-gradient;
    // ... component styles
}
```

## Benefits

1. **Component Isolation** - Each component is self-contained
2. **Easy Maintenance** - Logic and styles are co-located
3. **Scalability** - Easy to add new components
4. **Clear Imports** - Obvious dependencies between files
5. **Modular SCSS** - Components import their own styles
6. **Global Styles** - Core styles remain in separate directory

## Adding New Components

1. Create component directory: `src/components/my-component/`
2. Add `my-component.js` with component logic
3. Add `my-component.scss` with component styles
4. Import styles in JS: `import './my-component.scss'`
5. Import component where needed: `import { myComponent } from '../components/my-component/my-component.js'`

## Build System

- **Build Tool**: Vite
- **CSS Preprocessor**: SCSS
- **Dev Server**: `npm run dev` (localhost:3000)
- **Build**: `npm run build`
- **Preview**: `npm run preview`