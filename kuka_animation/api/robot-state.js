// api/robot-state.js
let robotState = {
  state: 'green',
  timestamp: new Date().toISOString(),
  message: 'OK'
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Return current state
      return res.status(200).json(robotState);
    }

    if (req.method === 'POST') {
      // Handle different ways Vercel might provide the body
      let action;
      
      try {
        if (req.body) {
          // If body is already parsed
          if (typeof req.body === 'object') {
            action = req.body.action;
          } else if (typeof req.body === 'string') {
            // If body is a string, parse it
            const parsed = JSON.parse(req.body);
            action = parsed.action;
          }
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return res.status(400).json({ 
          error: 'Invalid JSON format',
          received: req.body 
        });
      }

      // Debug log
      console.log('Received action:', action, 'Body type:', typeof req.body, 'Body:', req.body);

      if (action === 'toggle') {
        switch (robotState.state) {
          case 'green':
            robotState.state = 'yellow';
            robotState.message = 'DDOS started';
            break;
          case 'yellow':
            robotState.state = 'red';
            robotState.message = 'DDOS successful';
            break;
          case 'red':
            robotState.state = 'green';
            robotState.message = 'OK';
            break;
        }
      } else if (['green', 'yellow', 'red'].includes(action)) {
        robotState.state = action;
        switch (action) {
          case 'green':
            robotState.message = 'OK';
            break;
          case 'yellow':
            robotState.message = 'DDOS started';
            break;
          case 'red':
            robotState.message = 'DDOS successful';
            break;
        }
      } else {
        return res.status(400).json({ 
          error: 'Invalid action',
          validActions: ['toggle', 'green', 'yellow', 'red'],
          received: action
        });
      }

      robotState.timestamp = new Date().toISOString();
      return res.status(200).json({ 
        success: true, 
        ...robotState 
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
}