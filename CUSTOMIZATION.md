# Private customization layer

This fork intentionally keeps its visual changes small and isolated so updates
from `PasarGuard/subscription-template` remain easy to merge.

## Custom files

- `src/assets/brand/logo.png`
- `src/brand.css`
- `src/components/brand-mark.tsx`
- `install-custom.sh`

## Small upstream-file edits

- `src/main.tsx` imports the private visual layer.
- `src/App.tsx` renders the logo instead of the dashboard heading.
- `src/components/layout/layout.tsx` does not render the upstream footer.

The WireGuard conversion, QR modal, subscription data, application catalog,
and application API integration are not customized.

## Syncing upstream

GitHub's **Sync fork** button can normally update `main` without conflicts.
The equivalent command-line flow is:

```bash
git remote add upstream https://github.com/PasarGuard/subscription-template.git
git fetch upstream
git merge upstream/main
npm install --package-lock=false
npm run lint
npm run build
```

After validation, publish a new release in this fork. The inherited release
workflow builds the standalone HTML assets for every supported language.

Applications configured in the PasarGuard dashboard are stored by the panel,
not in this template repository. Updating or reinstalling the template does
not delete those application records.
