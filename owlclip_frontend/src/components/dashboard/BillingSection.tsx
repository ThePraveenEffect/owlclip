'use client';

import { Check, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const plans = [
{
id: 'starter',
name: 'Starter',
price: 9,
period: '/mo',
description:
'Start turning long videos into short viral clips.',

credits: 250,

highlight:
  '~25 video processing sessions',

features: [
  'Process up to ~25 videos / month',
  'Every processed video generates up to 2 viral clips',
  'Auto subtitles included',
  'Subtitle editor + basic subtitle styles',
  'Credits roll over for 30 days',
  'Email support',
],

cta: 'Start Creating',

popular: false,


},

{
id: 'creator',
name: 'Creator',

price: 29,

period: '/mo',

description:
  'Built for creators publishing consistently.',

credits: 1000,

highlight:
  '~100 video processing sessions',

features: [
  'Process up to ~100 videos / month',
  'Every processed video generates up to 2 viral clips',
  'Premium subtitle styles included',
  'Subtitle customization',
  'Batch uploads',
  'Early access to new clip formats',
  'Credits roll over for 30 days',
  'Priority support',
],

cta: 'Upgrade to Creator',

popular: true,

},
];






export default function BillingSection() {
 
  const router = useRouter();

  const[subscriptionStatus, setSubscriptionStatus] = useState<"active" | "inactive">("inactive");

   useEffect(()=>{
    verifyUserPayment();
   },[])


  const verifyUserPayment = async()=>{
    const res = await axios.get("/api/v1/payment/verify",
      {withCredentials:true}
    );

    if(res.data.payment_verified==="active"){
      setSubscriptionStatus("active");
      router.push("/dashboard");
    }
  }


  const handleBuyClick = async(type)=>{
   const order = await axios.post("/api/v1/payment/create",
    {
      tier: type,
    },{withCredentials:true}
   )

   const {razorpay_key_id, payment} = order.data;
    

   const options = {
    "key": razorpay_key_id, // Enter the Key ID generated from the Dashboard
    "amount": payment.amount, // Amount is in currency subunits. 
    "currency": payment.currency,
    "name": "OwlClip",
    "description": "Access OwlClip premium tools",
    // "image": "https://example.com/your_logo",
    "order_id": payment.order_id, 
    "prefill": {
        "name": payment.notes.username,
        "email": payment.notes.email,
        // "contact": "+919876543210"
    },
    "theme": {
        "color": "#3399cc"
    },
    "handler": verifyUserPayment,
};


   var rzp1 = new globalThis.Razorpay(options);
   rzp1.open();


  }




  return (
    subscriptionStatus !== "active" &&<div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Subscription</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Choose the plan that fits your workflow</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'relative rounded-xl border p-5 transition-all duration-200',
              plan.popular
                ? 'border-orange-500/50 bg-orange-500/5 shadow-lg shadow-orange-500/5'
                : 'border-border bg-muted/20 hover:border-border/80'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-black bg-orange-500 border border-orange-500 px-2.5 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" />
                  Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-lg font-bold text-foreground">{plan.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-foreground">${plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-5">{plan.credits} credits/month</p>

            <ul className="space-y-2.5 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>

            <button  onClick={()=>handleBuyClick(plan.id)}
              className={cn(
                'w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                plan.popular
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20'
                  : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div> 
  );
}
