import { Feature } from "@/lib/types";

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
      <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
        <i className={`fas ${feature.icon} text-xl`}></i>
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  );
}
