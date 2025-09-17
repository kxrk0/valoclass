import fs from 'fs';
import path from 'path';

// Manual environment loader as backup
export const loadEnvManually = () => {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          process.env[key.trim()] = value.trim();
        }
      }
    });
    
    console.log('✅ Environment variables loaded manually');
    return true;
  } catch (error) {
    console.error('❌ Failed to load environment manually:', error);
    return false;
  }
};
