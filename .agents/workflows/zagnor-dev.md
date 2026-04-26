---
description: Zagnor Development & Deployment Workflow
---

# 🚀 Zagnor Nexus Workflow

This workflow ensures a smooth development cycle from design to deployment.

## 1. 🏗️ Setup & Initialization
// turbo
Initialize the project structure with Vite and dependencies.
```powershell
npx -y create-vite@latest ./ --template react-ts
npm install three @types/three @react-three/fiber @react-three/drei lucide-react
```

## 2. 🎨 Designing the Aesthetic
Define the "Zagnor Visual Language" in `index.css`.
- Use `hsl` for vibrant colors.
- Implement glassmorphism utilities.

## 3. 🧪 Component Iteration
1. Create a 3D component (e.g., `src/components/NexusCore.tsx`).
2. Run `npm run dev` to preview.
3. Use the **Browser Subagent** to verify animations and layout.

## 4. 🛰️ Data Integration
- Connect the 3D nodes to your **Cassandra** service.
- If Cassandra is local, ensure the bridge API is running.

## 5. 🛫 Production Build
// turbo
Create a production-ready bundle.
```powershell
npm run build
```

## 6. 🧹 Cleanup & Documentation
Update the `walkthrough.md` with every major milestone.
