# Navigate to root folder
cd "C:\Users\anmol\OneDrive\Desktop\EcoHealth-Sentinel\EcoHealth-Sentinel"

# Deploy frontend
Write-Host "Deploying frontend..."
cd frontend
vercel --prod --confirm

# Deploy backend
Write-Host "Deploying backend..."
cd ../backend
vercel --prod --confirm

# Deploy backend1 (FastAPI)
Write-Host "Deploying backend1..."
cd ../backend1
vercel --prod --confirm

# Deploy gateway
Write-Host "Deploying gateway..."
cd ../gateway
vercel --prod --confirm

Write-Host "All deployments done!"
