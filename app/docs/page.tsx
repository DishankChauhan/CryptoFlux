'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Code, Terminal, Wallet, Webhook } from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        
        <Tabs defaultValue="quickstart">
          <TabsList className="bg-[#1A2C4D]">
            <TabsTrigger value="quickstart">
              <Terminal className="w-4 h-4 mr-2" />
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="api">
              <Code className="w-4 h-4 mr-2" />
              API Reference
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Webhook className="w-4 h-4 mr-2" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart">
            <Card className="p-6 bg-[#1A2C4D] border-none">
              <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-2">1. Create an Account</h3>
                  <p className="text-gray-300">Sign up for a CryptoFlux account to get your API keys.</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">2. Install the SDK</h3>
                  <div className="bg-[#0A1A2F] p-4 rounded-md">
                    <code className="text-sm text-gray-300">npm install @cryptoflux/sdk</code>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">3. Initialize the Client</h3>
                  <div className="bg-[#0A1A2F] p-4 rounded-md">
                    <pre className="text-sm text-gray-300">
                      <code>{`import { CryptoFlux } from '@cryptoflux/sdk';

const cryptoflux = new CryptoFlux({
  apiKey: 'your_api_key'
});`}</code>
                    </pre>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">4. Create a Payment</h3>
                  <div className="bg-[#0A1A2F] p-4 rounded-md">
                    <pre className="text-sm text-gray-300">
                      <code>{`const payment = await cryptoflux.createPayment({
  amount: "0.1",
  currency: "ETH",
  success_url: "https://your-site.com/success",
  cancel_url: "https://your-site.com/cancel",
  callback_url: "https://your-site.com/webhook"
});

// Redirect to payment page
window.location.href = payment.payment_url;`}</code>
                    </pre>
                  </div>
                </section>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="p-6 bg-[#1A2C4D] border-none">
              <h2 className="text-2xl font-bold mb-4">API Reference</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-2">Authentication</h3>
                  <p className="text-gray-300 mb-4">
                    All API requests require an API key to be included in the header:
                  </p>
                  <div className="bg-[#0A1A2F] p-4 rounded-md">
                    <code className="text-sm text-gray-300">
                      X-API-Key: your_api_key
                    </code>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">Endpoints</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#00F5E9] mb-2">POST /api/v1/payment</h4>
                      <p className="text-gray-300 mb-2">Create a new payment request</p>
                      <div className="bg-[#0A1A2F] p-4 rounded-md">
                        <pre className="text-sm text-gray-300">
                          <code>{`{
  "amount": "0.1",
  "currency": "ETH",
  "success_url": "https://your-site.com/success",
  "cancel_url": "https://your-site.com/cancel",
  "callback_url": "https://your-site.com/webhook",
  "metadata": {
    "order_id": "123"
  }
}`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#00F5E9] mb-2">GET /api/v1/payment/:id</h4>
                      <p className="text-gray-300">Get payment status</p>
                    </div>
                  </div>
                </section>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card className="p-6 bg-[#1A2C4D] border-none">
              <h2 className="text-2xl font-bold mb-4">Webhook Integration</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-2">Setup Webhooks</h3>
                  <p className="text-gray-300 mb-4">
                    Configure webhooks to receive real-time payment updates:
                  </p>
                  <div className="bg-[#0A1A2F] p-4 rounded-md">
                    <pre className="text-sm text-gray-300">
                      <code>{`POST /api/v1/webhook
{
  "url": "https://your-site.com/webhook",
  "events": ["payment.success", "payment.failed"]
}`}</code>
                    </pre>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">Webhook Events</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• payment.success - Payment was successful</li>
                    <li>• payment.failed - Payment failed</li>
                    <li>• payment.pending - Payment is pending</li>
                  </ul>
                </section>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}