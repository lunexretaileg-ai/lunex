import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRight, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { ProductWithVariants } from "@shared/schema";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type SelectionState = {
  category: string;
  productId: number | null;
  storage: string;
  color: string;
  minCondition: number;
  minBattery: number;
  deviceType: string;
};

export default function BuildDevicePage() {
  const { data: allProducts, isLoading } = useProducts();
  
  const [step, setStep] = useState<Step>(1);
  const [selection, setSelection] = useState<SelectionState>({
    category: "",
    productId: null,
    storage: "",
    color: "",
    minCondition: 7,
    minBattery: 80,
    deviceType: "",
  });

  const resetBuilder = () => {
    setSelection({
      category: "",
      productId: null,
      storage: "",
      color: "",
      minCondition: 7,
      minBattery: 80,
      deviceType: "",
    });
    setStep(1);
  };

  // Data processing for each step
  const categories = useMemo(() => {
    if (!allProducts) return [];
    const cats = new Set(allProducts.map(p => p.category));
    return Array.from(cats);
  }, [allProducts]);

  const availableModels = useMemo(() => {
    if (!allProducts || !selection.category) return [];
    return allProducts.filter(p => p.category === selection.category);
  }, [allProducts, selection.category]);

  const selectedProduct = useMemo(() => {
    return allProducts?.find(p => p.id === selection.productId) || null;
  }, [allProducts, selection.productId]);

  const availableStorages = useMemo(() => {
    if (!selectedProduct) return [];
    const storages = new Set(selectedProduct.variants.map(v => v.storage).filter(Boolean));
    return Array.from(storages) as string[];
  }, [selectedProduct]);

  const availableColors = useMemo(() => {
    if (!selectedProduct) return [];
    let variants = selectedProduct.variants;
    if (selection.storage) {
      variants = variants.filter(v => v.storage === selection.storage);
    }
    const colors = new Set(variants.map(v => v.color).filter(Boolean));
    return Array.from(colors) as string[];
  }, [selectedProduct, selection.storage]);

  // Final matches based on all criteria
  const finalMatches = useMemo(() => {
    if (!allProducts || step !== 7) return [];
    
    return allProducts.filter(p => {
      // Basic product filters
      if (selection.category && p.category !== selection.category) return false;
      if (selection.productId && p.id !== selection.productId) return false;
      if (selection.deviceType && p.deviceType !== selection.deviceType) return false;
      
      // Check if it has any variants matching the deep criteria
      const matchingVariants = p.variants.filter(v => {
        if (selection.storage && v.storage !== selection.storage) return false;
        if (selection.color && v.color !== selection.color) return false;
        if (v.conditionScore < selection.minCondition) return false;
        if (v.batteryHealth < selection.minBattery) return false;
        return true;
      });
      
      return matchingVariants.length > 0;
    });
  }, [allProducts, selection, step]);


  // UI Helpers
  const stepTitles = {
    1: "Select Category",
    2: "Choose Model",
    3: "Select Storage",
    4: "Pick a Color",
    5: "Quality Requirements",
    6: "Device Type",
    7: "Your Matches"
  };

  const nextStep = () => {
    // Skip storage/color if the category doesn't use it (e.g. some accessories)
    if (step === 2 && availableStorages.length === 0) setStep(5);
    else if (step === 3 && availableColors.length === 0) setStep(5);
    else setStep((s) => Math.min(s + 1, 7) as Step);
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as Step);

  if (isLoading) {
    return <div className="min-h-screen pt-32 text-center text-muted-foreground animate-pulse">Loading builder...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Build Your Device
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us exactly what you want, and we'll search our verified inventory to find your perfect match.
          </p>
        </div>

        {/* Builder Container */}
        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm">
          
          {/* Progress Bar */}
          <div className="flex border-b border-border bg-muted/20">
            {[1,2,3,4,5,6,7].map((num) => (
              <div 
                key={num} 
                className={`flex-1 h-1.5 ${step >= num ? 'bg-primary' : 'bg-transparent'} transition-colors duration-300`}
              />
            ))}
          </div>

          {/* Builder Body */}
          <div className="p-8 md:p-12">
            
            {/* Nav Row */}
            <div className="flex items-center justify-between mb-8">
              {step > 1 && step < 7 ? (
                <button onClick={prevStep} className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
              ) : <div></div>}
              
              <div className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Step {step} of 7
              </div>
              
              {step === 7 ? (
                <button onClick={resetBuilder} className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                </button>
              ) : <div></div>}
            </div>

            <h2 className="text-3xl font-bold mb-10 text-center">{stepTitles[step]}</h2>

            {/* STEP 1: Category */}
            {step === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelection({...selection, category: cat, productId: null, storage: "", color: ""});
                      nextStep();
                    }}
                    className={`p-6 rounded-2xl border-2 text-center transition-all capitalize text-lg font-bold min-h-[120px] flex items-center justify-center
                      ${selection.category === cat ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: Model */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModels.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelection({...selection, productId: product.id, storage: "", color: ""});
                      nextStep();
                    }}
                    className={`flex items-center gap-6 p-4 rounded-2xl border-2 transition-all text-left
                      ${selection.productId === product.id ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <div className="w-16 h-16 bg-white rounded-xl p-2 flex-shrink-0">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground block truncate">{product.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: Storage */}
            {step === 3 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableStorages.map(storage => (
                  <button
                    key={storage}
                    onClick={() => {
                      setSelection({...selection, storage, color: ""});
                      nextStep();
                    }}
                    className={`p-6 rounded-2xl border-2 text-center transition-all text-xl font-bold
                      ${selection.storage === storage ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 4: Color */}
            {step === 4 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelection({...selection, color});
                      nextStep();
                    }}
                    className={`p-6 rounded-2xl border-2 text-center transition-all font-bold
                      ${selection.color === color ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 5: Sliders (Condition & Battery) */}
            {step === 5 && (
              <div className="max-w-xl mx-auto space-y-12">
                <div>
                  <h3 className="text-xl font-bold mb-2 flex justify-between">
                    Minimum Condition 
                    <span className="text-primary">{selection.minCondition}/10</span>
                  </h3>
                  <p className="text-muted-foreground mb-6">How pristine does the exterior need to be?</p>
                  <input 
                    type="range" 
                    min="7" max="10" step="1"
                    value={selection.minCondition}
                    onChange={(e) => setSelection({...selection, minCondition: parseInt(e.target.value)})}
                    className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-sm font-medium text-muted-foreground mt-3">
                    <span>Good (7)</span>
                    <span>Flawless (10)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 flex justify-between">
                    Minimum Battery Health
                    <span className="text-primary">{selection.minBattery}%</span>
                  </h3>
                  <p className="text-muted-foreground mb-6">Applies to devices with measured batteries.</p>
                  <input 
                    type="range" 
                    min="70" max="100" step="5"
                    value={selection.minBattery}
                    onChange={(e) => setSelection({...selection, minBattery: parseInt(e.target.value)})}
                    className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-sm font-medium text-muted-foreground mt-3">
                    <span>70%</span>
                    <span>100% (New)</span>
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <button onClick={nextStep} className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full text-lg hover:scale-[1.02] transition-transform">
                    Continue to Device Type
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Device Type */}
            {step === 6 && (
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <button
                    onClick={() => setSelection({...selection, deviceType: "refurbished"})}
                    className={`p-6 rounded-2xl border-2 text-left transition-all
                      ${selection.deviceType === "refurbished" ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">Original Refurbished</h3>
                    <p className="text-muted-foreground text-sm">Previously owned Apple device, repaired and certified to factory standards.</p>
                  </button>

                  <button
                    onClick={() => setSelection({...selection, deviceType: "assembled"})}
                    className={`p-6 rounded-2xl border-2 text-left transition-all
                      ${selection.deviceType === "assembled" ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">Assembled</h3>
                    <p className="text-muted-foreground text-sm">Built from high-quality parts by our technicians. Performs identically to new.</p>
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                       setSelection({...selection, deviceType: ""}); 
                       nextStep();
                    }}
                    className="text-muted-foreground underline hover:text-foreground mb-6 block w-full"
                  >
                    I don't have a preference
                  </button>
                  <button 
                    onClick={nextStep} 
                    disabled={!selection.deviceType}
                    className="px-8 py-4 w-full md:w-auto bg-primary text-primary-foreground font-bold rounded-full text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Show My Matches <ChevronRight className="w-5 h-5 inline ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: Results */}
            {step === 7 && (
              <div>
                <div className="mb-8 text-center">
                  <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                    Builder Complete
                  </span>
                  <p className="text-xl">
                    We found <strong className="text-primary">{finalMatches.length}</strong> devices matching your exact configuration.
                  </p>
                </div>

                {finalMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {finalMatches.map(product => (
                      <ProductCard key={product.id} product={product as any} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-background">
                    <h3 className="text-2xl font-bold mb-2">No exact matches currently in stock</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Try relaxing your condition or battery requirements, or check if different colors are available.
                    </p>
                    <button onClick={prevStep} className="px-6 py-3 bg-secondary text-foreground font-medium rounded-full">
                      Adjust Requirements
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
