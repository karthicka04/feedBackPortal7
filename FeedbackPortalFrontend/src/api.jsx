export const login = async (email, password) => {
    try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        let responseData = {};
        try {
            responseData = await response.json();
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            responseData = { message: "Invalid JSON response from server." };
        }

        if (!response.ok) {
            let errorMessage = "Login failed! Check credentials.";
            errorMessage = responseData.message || errorMessage;

            throw new Error(errorMessage);
        }

        return responseData;
    } catch (error) {
        console.error("Login error:", error.message);
        return { error: error.message };


    }
};

export const admin = async (name, email, password) => {
    try {
        const response = await fetch("http://localhost:3001/api/admin/add-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        // Attempt to parse JSON regardless of response status
        let responseData = {};
        try {
            responseData = await response.json();
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            responseData = { message: "Invalid JSON response from server." };  // Default message if parse fails
        }

        if (!response.ok) {
            let errorMessage = "User adding failed!";
            errorMessage = responseData.message || errorMessage;

            throw new Error(errorMessage);
        }

        return responseData;
    } catch (error) {
        console.error("Added user error:", error.message);
        return { error: error.message };
    }
};
export const feedback = async (feedbackData) => {
    try {
      const data = await apiRequest('/feedback', 'POST', feedbackData);  // Using Feedback Routes.
      return data; // Return the response data if successful
    } catch (error) {
      return { error: error.message }; // Return error message
    }
  };
