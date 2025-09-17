# 🎮 Riot Games Frontend Integration Guide

## API Endpoints Overview

### 1. Search for Riot Account
```http
POST /api/auth/riot/search
Content-Type: application/json

{
  "gameName": "PlayerName",
  "tagLine": "TAG",
  "region": "tr1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "account": {
      "puuid": "...",
      "gameName": "PlayerName",
      "tagLine": "TAG"
    },
    "summoner": {
      "id": "...",
      "name": "PlayerName",
      "summonerLevel": 150,
      "profileIconId": 588
    },
    "rankedInfo": [...],
    "recentMatches": [...]
  }
}
```

### 2. Start Verification Process
```http
POST /api/auth/riot/verify/start
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "puuid": "player-puuid",
  "verificationType": "profile_icon"
}
```

### 3. Complete Verification
```http
POST /api/auth/riot/verify/complete
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "puuid": "player-puuid",
  "region": "tr1"
}
```

## Frontend React Implementation Example

```tsx
// components/auth/RiotLogin.tsx
import React, { useState } from 'react';

interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface VerificationChallenge {
  challenge: string;
  type: string;
  expiresAt: number;
  instructions: string;
}

export const RiotLogin: React.FC = () => {
  const [step, setStep] = useState<'search' | 'verify' | 'complete'>('search');
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [region, setRegion] = useState('tr1');
  const [account, setAccount] = useState<RiotAccount | null>(null);
  const [challenge, setChallenge] = useState<VerificationChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/riot/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName, tagLine, region })
      });

      const data = await response.json();

      if (data.success) {
        setAccount(data.data.account);
        setStep('verify');
      } else {
        setError(data.error || 'Account not found');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const startVerification = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/riot/verify/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ 
          puuid: account.puuid,
          verificationType: 'profile_icon'
        })
      });

      const data = await response.json();

      if (data.success) {
        setChallenge(data.data);
      } else {
        setError(data.error || 'Failed to create verification challenge');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const completeVerification = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/riot/verify/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ 
          puuid: account.puuid,
          region
        })
      });

      const data = await response.json();

      if (data.success) {
        setStep('complete');
        // Redirect or update UI to show successful linking
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = () => {
    // Get access token from your auth system
    return localStorage.getItem('access_token') || '';
  };

  return (
    <div className="riot-login-container">
      {step === 'search' && (
        <div className="search-step">
          <h3>🎮 Link Your Riot Account</h3>
          <div className="form-group">
            <label>Game Name:</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter your Riot Game Name"
            />
          </div>
          <div className="form-group">
            <label>Tag Line:</label>
            <input
              type="text"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              placeholder="Enter your Tag (e.g., TR1)"
              maxLength={5}
            />
          </div>
          <div className="form-group">
            <label>Region:</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="tr1">Turkey (TR1)</option>
              <option value="euw1">Europe West (EUW1)</option>
              <option value="eune1">Europe Nordic East (EUNE1)</option>
              <option value="na1">North America (NA1)</option>
            </select>
          </div>
          <button 
            onClick={searchAccount} 
            disabled={loading || !gameName || !tagLine}
          >
            {loading ? 'Searching...' : 'Search Account'}
          </button>
        </div>
      )}

      {step === 'verify' && account && (
        <div className="verify-step">
          <h3>✅ Account Found!</h3>
          <p>
            <strong>{account.gameName}#{account.tagLine}</strong>
          </p>
          
          {!challenge ? (
            <div>
              <p>Click below to start the verification process.</p>
              <button onClick={startVerification} disabled={loading}>
                {loading ? 'Starting...' : 'Start Verification'}
              </button>
            </div>
          ) : (
            <div className="challenge-instructions">
              <h4>🔐 Verification Challenge</h4>
              <div className="challenge-box">
                <p><strong>Challenge:</strong> {challenge.challenge}</p>
                <p><strong>Instructions:</strong> {challenge.instructions}</p>
                <p><strong>Expires:</strong> {new Date(challenge.expiresAt).toLocaleString()}</p>
              </div>
              <p className="warning">
                ⚠️ Complete the above challenge in your League of Legends client, then click verify.
              </p>
              <button onClick={completeVerification} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'complete' && (
        <div className="complete-step">
          <h3>🎉 Success!</h3>
          <p>Your Riot account has been successfully linked!</p>
          <button onClick={() => window.location.reload()}>
            Continue
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
    </div>
  );
};
```

## CSS Styling Example

```css
/* styles/riot-login.css */
.riot-login-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #f0c040;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #463714;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f0c040;
  box-shadow: 0 0 0 3px rgba(240, 192, 64, 0.3);
}

button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(45deg, #c89b3c 0%, #f0c040 100%);
  border: none;
  border-radius: 6px;
  color: #1e2328;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(240, 192, 64, 0.4);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.challenge-box {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  border-left: 4px solid #f0c040;
}

.challenge-instructions h4 {
  color: #f0c040;
  margin-bottom: 1rem;
}

.warning {
  color: #ff6b6b;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0;
}

.error-message {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
}

.complete-step {
  text-align: center;
}

.complete-step h3 {
  color: #4ecdc4;
  margin-bottom: 1rem;
}
```

## Integration with Existing Auth System

```tsx
// Update your LoginForm component to include Riot option
const LoginForm: React.FC = () => {
  const [showRiotLogin, setShowRiotLogin] = useState(false);

  return (
    <div className="login-container">
      {/* Existing login form */}
      
      <div className="divider">
        <span>or</span>
      </div>

      <button
        type="button"
        className="riot-login-button"
        onClick={() => setShowRiotLogin(true)}
      >
        <img src="/icons/riot-icon.svg" alt="Riot" />
        Continue with Riot ID
      </button>

      {/* Riot Login Modal */}
      {showRiotLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setShowRiotLogin(false)}
            >
              ×
            </button>
            <RiotLogin />
          </div>
        </div>
      )}
    </div>
  );
};
```

## Error Handling

Common errors and how to handle them:

- **Account Not Found**: Display friendly message asking user to check spelling
- **Rate Limit**: Show wait time and retry button
- **Verification Failed**: Provide clear instructions and retry option
- **Network Error**: Show retry button with exponential backoff
- **Expired Challenge**: Automatically start new verification

## Security Considerations

1. **API Keys**: Never expose Riot API keys in frontend code
2. **Rate Limiting**: Implement client-side request queuing
3. **CORS**: Ensure proper CORS configuration for your domain
4. **Token Security**: Secure storage of access tokens
5. **Validation**: Always validate user inputs before API calls

## Testing

Test with real Riot accounts to ensure:
- ✅ Account search works across regions
- ✅ Verification challenges are created correctly
- ✅ Account linking persists correctly
- ✅ Error states are handled gracefully
- ✅ Rate limits don't break user experience

