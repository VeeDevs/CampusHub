Write-Host "CampusHub bootstrap starting..."

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Created .env from .env.example"
}

& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run prisma:generate
& 'C:\Program Files\nodejs\npm.cmd' run db:migrate
& 'C:\Program Files\nodejs\npm.cmd' run seed

Write-Host "Bootstrap complete. Run: npm run dev"
