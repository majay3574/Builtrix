# Use Node.js base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy everything from your project folder into container
COPY . .

# Install npm dependencies
RUN npm install

# Install http-server globally to serve report
RUN npm install -g http-server


# Install Playwright browsers
RUN npx playwright install

# If you only need specific browsers, you can specify them like this:
RUN npx playwright install chrome

# Default command to run tests and serve report
CMD ["sh", "-c", "npx playwright test && http-server playwright-report -p 1234 -a 0.0.0.0"]
