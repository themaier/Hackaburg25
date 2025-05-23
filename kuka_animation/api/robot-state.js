// api/robot-state.js
let robotState = {
  state: 'green',
  timestamp: new Date().toISOString(),
  message: 'OK'
};

export default function handler(req, res) {
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
      // Parse request body - handle both parsed and unparsed JSON
      let body;
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body);
      } else {
        body = req.body || {};
      }
      
      const { action } = body;

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
      details: error.message 
    });
  }
}