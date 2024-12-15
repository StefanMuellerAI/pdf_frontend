# Redact-o-mat (BETA)

A modern web application for automated document redaction, powered by Mistral_Large_Latest LLM.

![Redact-o-mat Screenshot](screenshot.png)

## Features

- 📄 PDF Document Upload
- 🔍 Intelligent Detection of Sensitive Information
- ✂️ Automated Redaction of:
  - Email Addresses
  - Personal Names
  - Phone Numbers
- 🔒 Secure Processing
- 📥 Instant Download of Redacted Documents

## Technology Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons
- React Markdown

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/redact-o-mat.git
cd redact-o-mat
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:

`.env.development`:
```env
VITE_API_URL=http://localhost:5001
VITE_BEARER_TOKEN=development_token
```

`.env.production`:
```env
VITE_API_URL=https://api.redact-o-mat.de
VITE_BEARER_TOKEN=your_production_token
```

### Development

Start the development server:
```bash
npm run dev
```

### Building for Production

Build the application:
```bash
npm run build
```

## API Integration

The application integrates with a backend API that processes documents using Mistral_Large_Latest LLM. The API endpoints are:

- `POST /upload` - Upload PDF for processing
- `GET /status/:taskId` - Check processing status and download result

## Environment Configuration

- Development: Uses local API (http://localhost:5001)
- Production: Uses production API (https://api.redact-o-mat.de)

## Security

- All data is processed in memory
- No permanent storage of uploaded or processed files
- Secure file transmission using HTTPS
- Bearer token authentication for API requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Acknowledgments

- Built by [StefanAI](https://stefanai.de)
- Powered by Mistral_Large_Latest LLM
- UI components from Tailwind CSS 