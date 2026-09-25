# Umair Amanat — portfolio source, hover fix

Same site design and assets as the published Digital Workshop portfolio.

## Start
Extract the complete ZIP first. Open dist/index.html, or serve it with VS Code Live Server. Recommended terminal method from this folder:

    python -m http.server 8000 --directory dist

Then open http://localhost:8000. For Vite development: npm ci, then npm run dev.

Move your mouse across the storefront composition to tilt its layers. The Motion button must show Motion on. Reduced-motion system settings initially disable animations; use the button to enable them if desired. Touch interaction intentionally preserves scrolling instead of emulating mouse hover.

## Fix
The hero script no longer uses type=module, which could prevent loading when opening the HTML through file://. Its variables are isolated in an IIFE to avoid collisions with app.js. Pointer tweens replace previous pointer tweens for responsive movement. The hosted and exported files match.

## Files
- dist/index.html: page markup and all 15 projects
- dist/style.css: all styles and responsive layouts
- dist/app.js: GSAP smooth scrolling and section effects
- dist/sculpture.js: hero floating and pointer animation
- dist/assets: project images
- dist/vendor: included animation dependencies

Upload the contents of dist to a static web host. No production build is required. Fonts load from Google Fonts. Third-party libraries retain their respective licenses.
