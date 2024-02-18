// sendDataToEndpoint.js

const sendDataToEndpoint = async (data, endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send data to the endpoint');
      }
      else {
        console.log('Data successfully sent to the endpoint!');
      }
  
      const result = await response.json();
      console.log('Response from endpoint:', result);
    } catch (error) {
      console.error('Error sending data to the endpoint:', error);
    }
};
  
export { sendDataToEndpoint };  