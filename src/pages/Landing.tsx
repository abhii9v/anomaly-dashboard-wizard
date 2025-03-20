
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  BarChart3,
  Cloud 
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="px-6 pt-20 lg:pt-32 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              AI-Powered <span className="text-blue-600">Anomaly Detection</span> For Digital Advertising
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Protect your ad spend with our advanced AI system that detects and prevents fraudulent activity in real-time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate("/dashboard")}
              >
                Try It Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-blue-100 rounded-2xl p-4 shadow-xl">
              <img 
                src="/placeholder.svg" 
                alt="Anomaly detection dashboard preview" 
                className="w-full h-auto rounded-lg shadow-sm"
              />
              <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-ping-slow">
                Anomaly Detected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our AI Solution?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="Powerful & Robust"
              description="Leverages advanced machine learning models to detect and prevent fraud in real-time across multiple channels."
            />
            
            <FeatureCard 
              icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
              title="Multi-Client Utility"
              description="Scalable and versatile system capable of serving multiple clients simultaneously with customizable protection."
            />
            
            <FeatureCard 
              icon={<Cloud className="h-8 w-8 text-blue-600" />}
              title="SaaS-Enabled Solution"
              description="Offers flexibility, easy deployment, and eliminates the need for complex infrastructure management."
            />
            
            <FeatureCard 
              icon={<AlertCircle className="h-8 w-8 text-blue-600" />}
              title="Real-time Alerts"
              description="Instant notifications when anomalies are detected, allowing for immediate action."
            />
            
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
              title="Predictive Analytics"
              description="Forecasts ad spend for upcoming periods considering multiple exogenous factors."
            />
            
            <FeatureCard 
              icon={<CheckCircle2 className="h-8 w-8 text-blue-600" />}
              title="Peak Season Ready"
              description="Designed to handle traffic surges during busy periods like Black Friday and Holiday Season."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <ol className="space-y-8">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Forecast Ad Spend</h3>
                    <p className="text-gray-600">Our system forecasts hourly ad spend taking into account multiple factors like hour of day, day of month, holidays, and more.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Compare & Analyze</h3>
                    <p className="text-gray-600">The system compares the forecast to actual spend and identifies deviations.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Detect Anomalies</h3>
                    <p className="text-gray-600">If the actual value lies outside the confidence interval, it classifies the spend as an anomaly.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Take Action</h3>
                    <p className="text-gray-600">The system can update daily allocated budget to zero to prevent overspending and fraudulent activity.</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src="/placeholder.svg" 
                alt="Anomaly detection process" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Ad Spend?</h2>
          <p className="text-xl mb-10">Start detecting anomalies and preventing fraud with our AI-powered solution today.</p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate("/dashboard")}
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;
