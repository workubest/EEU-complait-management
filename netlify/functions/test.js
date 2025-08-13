// Simple test function to verify Netlify Functions are working
exports.handler = async function(event, context) {
  console.log('🧪 Test function called');
  console.log('📝 Method:', event.httpMethod);
  console.log('🔗 Headers:', event.headers);
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      message: 'Netlify Functions are working!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path,
    }),
  };
};