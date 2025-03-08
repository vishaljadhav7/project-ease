import Link from "next/link";
import { Check } from "lucide-react";
import { Twitter, Facebook, Instagram, Linkedin, CheckCircle, Zap, Users, BarChart } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Task Management",
    description: "Organize and track tasks with our intuitive interface. Set priorities, deadlines, and dependencies.",
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Automate repetitive tasks and workflows to save time and reduce manual work.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates, comments, and file sharing.",
  },
  {
    icon: BarChart,
    title: "Analytics",
    description: "Get insights into team performance and project progress with detailed reports.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for individuals and small teams",
    features: ["Up to 10 projects", "Basic task management", "File sharing", "Email support"],
  },
  {
    name: "Professional",
    price: "$29",
    description: "Best for growing teams",
    features: [
      "Unlimited projects",
      "Advanced task management",
      "Custom workflows",
      "Priority support",
      "Team analytics",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Everything in Pro", "Custom integrations", "Dedicated support", "Advanced security", "SLA guarantee"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="fixed top-0 w-full z-50 bg-white/90 shadow-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-blue-600">
            ProjectEase
          </Link>
      
          <div className="flex items-center gap-4">
            <Link href="/signin">
            <button className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Sign in</button>
            </Link>
            <Link href="/signup">            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300">
              Get Started
            </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 to-gray-100">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-12 items-center">
              <div className="space-y-8 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  Simplify Your Work with
                  <span className="text-blue-600"> ProjectEase</span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                  Streamline workflows, enhance collaboration, and boost productivity with our all-in-one solution.
                </p>
                <div className="flex gap-6 justify-center">
                  <Link href="/signup">
                  <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-300">
                    Get Started Free
                  </button>
                  </Link>
                  <button className="border border-gray-300 text-gray-600 hover:bg-gray-200 px-8 py-4 rounded-full text-lg transition-all duration-300">
                    View Demo
                  </button>
                </div>
                <div className="pt-10">
                  <p className="text-gray-500 mb-4">Trusted by 275,000+ customers worldwide</p>
                  <div className="flex gap-8 justify-center items-center">
                    {["Hubspot", "Gitlab", "Notion", "Microsoft", "Google"].map((brand) => (
                      <span key={brand} className="text-gray-400 text-sm font-medium">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">Achieve More with ProjectEase</h2>
              <p className="text-gray-600 text-lg">
                A powerful project management tool designed to help teams of all sizes succeed with ease and efficiency.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-blue-600">98%</h3>
                  <p className="text-gray-500">Customer Satisfaction</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
                  <p className="text-gray-500">Expert Support</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-blue-600">10x</h3>
                  <p className="text-gray-500">Faster Delivery</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-blue-600">50k+</h3>
                  <p className="text-gray-500">Active Users</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-100">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600">All the Tools You Need</h2>
              <p className="text-gray-600 text-lg mt-2">Empower your team with cutting-edge features</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600">Flexible Pricing Plans</h2>
              <p className="text-gray-600 text-lg mt-2">Find the perfect plan for your team</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-500">/month</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <button className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300">
                    Get Started
                  </button>
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <Check className="h-5 w-5 text-blue-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-blue-500 mb-4">ProjectEase</h3>
              <p className="text-gray-400">
                Simplify your projects and elevate productivity with our all-in-one solution.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">© {new Date().getFullYear()} ProjectEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}