# Deploy secrets

Configure these GitHub Actions secrets in the repository before running the production deploy workflow:

```text
VPS_HOST=138.219.41.19
VPS_USER=root
VPS_PORT=22
VPS_SSH_KEY=<complete private SSH key>
```

Use a dedicated deploy key for GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "github-actions-seguros2-deploy" -f ~/.ssh/seguros2_github_actions
```

Add the public key to the VPS:

```bash
cat ~/.ssh/seguros2_github_actions.pub
```

Paste that public key into `/root/.ssh/authorized_keys` on the VPS. Then paste the complete private key from `~/.ssh/seguros2_github_actions` into the `VPS_SSH_KEY` GitHub secret.

Never commit private keys or real secret values to this repository.
