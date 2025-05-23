let robotState = {
  state: 'green',
  timestamp: new Date().toISOString(),
  message: 'System Online - Green State'
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(robotState)
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
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
      }

      robotState.timestamp = new Date().toISOString();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, ...robotState })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};