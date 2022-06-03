<h1 align="center">Syl-Web - Static Starter 🚀</h1>
<h3 align="center">A Static Starter to make static website easily with Twig and Sass with auto deploy with Github Actions</h3>

## Languages and Tools
<img src="https://api.hephe.net/icons/gulp-brands.svg" alt="gulp" width="40" height="40">
<img src="https://api.hephe.net/icons/node-js-brands.svg" alt="nodejs" width="40" height="40">
<img src="https://api.hephe.net/icons/sass-brands.svg" alt="sass" width="40" height="40"/>
<img src="https://api.hephe.net/icons/html5-brands.svg" alt="html5" width="40" height="40">
<img src="https://api.hephe.net/icons/js-square-brands.svg" alt="javascript" width="40" height="40">

## 🚀 Github Action Requirments for CI/CD
Go on this link : https://github.com/user/repo/actions and add those following Action Secret to your project.
The deploy start on every Pull Request into the main branches. So be carefull to push your changes into à different branche and then, create a Pull Request to main.

Actions Secrets to add :
- `DEPLOY_DEST` Folder where the build will be uploader using `rsync`.
- `SSH_HOST` Should I really need to explain why ?
- `SSH_PORT`
- `SSH_USER`
- `SSH_KEY` Private key for your destination server user.

## 🔽 Installation:
  ```shell
  yarn
  gulp serve
  ```

## ✅ Build
  ```shell
  yarn
  npm run build
  ```
