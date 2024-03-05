// sendDataToEndpoint.js
const sendDataToEndpoint = async (requestData) => {
  
  const endpoint = 'http://10.35.13.102:3000/api';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Failed to send request data to the endpoint. HTTP status code: ${response.status}`);
    }
    else {
      console.log('Request data successfully sent to the endpoint!');
    }

    const result = await response.json();
    console.log('Response from endpoint:', result);
    return result;
  } catch (error) {
    console.error('Error sending request data to the endpoint:', error);
    throw error; // rethrow the error to be caught in the calling function
  }
};
  
export { sendDataToEndpoint };  
