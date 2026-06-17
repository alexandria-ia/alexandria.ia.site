'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, Copy, CheckSquare, Loader2 } from 'lucide-react';
import { useConfigStore, Transaction } from '@/stores/config-store';

interface CheckoutModalProps {
  isOpen: boolean;
  planName: string;
  price: number;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, planName, price, onClose }: CheckoutModalProps) {
  const store = useConfigStore();
  const [paymentStep, setPaymentStep] = useState<'pay' | 'success'>('pay');
  const [loading, setLoading] = useState(false);
  
  // Pix Data
  const [billingId, setBillingId] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);

  // Generate checkout Pix billing when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const generateBilling = async () => {
      setLoading(true);
      setPaymentStep('pay');
      setCopied(false);
      setSimulating(false);
      
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: planName.toLowerCase().includes('escribas') ? 'starter' : 'pro'
          })
        });

        if (!response.ok) {
          throw new Error('Falha ao processar checkout');
        }

        const data = await response.json();
        
        setBillingId(data.billingId);
        setPixCode(data.pixCode);
        setQrCodeUrl(data.qrCodeUrl);
        setCheckoutUrl(data.url);

        // Save transaction as pending in global store
        const newTx: Transaction = {
          id: data.billingId,
          plan: planName,
          amount: price,
          status: 'pending',
          timestamp: new Date().toLocaleString('pt-BR'),
          pixCode: data.pixCode
        };

        store.setConfig({
          transactions: [newTx, ...store.transactions]
        });

      } catch (err) {
        console.error('Erro de Checkout:', err);
      } finally {
        setLoading(false);
      }
    };

    generateBilling();
  }, [isOpen, planName, price]);

  const handleCopyPix = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    if (!billingId) return;
    setSimulating(true);

    try {
      // Trigger Webhook API route simulation
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-abacatepay-signature': 'mock-signature-hash-2026-alexandria'
        },
        body: JSON.stringify({
          event: 'billing.status.changed',
          data: {
            id: billingId,
            status: 'PAID',
            amount: price * 100,
            metadata: { plan: planName }
          }
        })
      });

      if (response.ok) {
        // Update local transaction status to approved
        const updatedTransactions = store.transactions.map(tx => 
          tx.id === billingId ? { ...tx, status: 'approved' as const } : tx
        );

        // Update state in config store
        store.setConfig({
          transactions: updatedTransactions,
          counterSubs: store.counterSubs + 1,
          counterTokens: store.counterTokens + Math.floor(Math.random() * 200000 + 50000)
        });

        setPaymentStep('success');
      }
    } catch (err) {
      console.error('Erro ao simular webhook de pagamento:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPaymentStep('pay');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-[8px]"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-[#0d0e12] border border-border-card rounded-[16px] p-6 md:p-9 max-w-[400px] w-full shadow-[0_24px_64px_rgba(0,0,0,0.6)] z-10 backdrop-blur-[24px]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={loading || simulating}
              className="absolute top-4 right-4 bg-none border-none text-text-muted hover:text-text-primary text-[18px] cursor-pointer transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent mb-1">
              Checkout — {store.abacatePaySandbox ? 'Abacate Pay Sandbox' : 'Abacate Pay'}
            </div>
            
            <div className="text-[17px] font-bold text-white mb-6 pb-4 border-b border-border-subtle uppercase tracking-wide">
              {planName} — R$ {price}/mês
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 size={32} className="text-accent animate-spin" />
                <span className="text-[11px] font-semibold tracking-widest text-text-secondary uppercase">
                  Gerando fatura Pix...
                </span>
              </div>
            ) : paymentStep === 'pay' ? (
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-3 mb-6 w-full">
                  
                  {/* Real QR Code image or Mock SVG */}
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="Pix QR Code" 
                      width={130} 
                      height={130} 
                      className="rounded-[8px] border border-white bg-white p-2"
                    />
                  ) : (
                    /* Mock QR Code SVG */
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ background: '#fff', padding: '8px' }}
                      className="rounded-[8px]"
                    >
                      <rect width="100" height="100" fill="white" />
                      <path
                        d="M5 5h30v30H5V5zm4 4v22h22V9H9zM5 65h30v30H5V65zm4 4v22h22V69H9zM65 5h30v30H65V5zm4 4v22h22V9H69z"
                        fill="#05070b"
                      />
                      <path
                        d="M45 15h10v10H45V15zm0 30h10v10H45V45zm15-15h10v10H60V30zm15 15h10v10H75V45zm-15 30h10v10H60V75zm15 0h10v10H75V75z"
                        fill="#05070b"
                      />
                      <path
                        d="M15 15h10v10H15V15zm0 60h10v10H15V75zm60-60h10v10H75V15z"
                        fill="#c9a55a"
                      />
                      <rect x="42" y="42" width="16" height="16" rx="2" fill="#c9a55a" />
                    </svg>
                  )}

                  <p className="text-[12px] text-text-muted text-center max-w-[260px]">
                    Escaneie o QR Code ou copie a chave Pix abaixo para pagar.
                  </p>

                  {/* Copy Pix Key Box */}
                  <div className="flex w-full bg-black/40 border border-border-card rounded-[8px] overflow-hidden mt-2">
                    <input
                      type="text"
                      readOnly
                      value={pixCode}
                      className="flex-1 bg-transparent border-none py-2 px-3 text-accent font-mono text-[10px] outline-none"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="text-[10px] font-bold tracking-wider bg-white/5 text-text-secondary border-none border-l border-border-card px-3 cursor-pointer hover:text-text-primary transition-colors flex items-center gap-1"
                    >
                      {copied ? <CheckSquare size={13} className="text-[#22c55e]" /> : <Copy size={13} />}
                      <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* Link alternative */}
                  {checkoutUrl && (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-accent hover:underline font-semibold mt-1 tracking-wide"
                    >
                      Abrir no portal da Abacate Pay →
                    </a>
                  )}
                </div>

                <button
                  onClick={handleSimulatePayment}
                  disabled={simulating}
                  className="w-full text-[12px] font-bold tracking-[0.06em] uppercase bg-accent text-bg-deep py-3.5 rounded-full hover:opacity-90 transition-opacity border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {simulating && <Loader2 size={14} className="animate-spin" />}
                  {simulating ? 'Aprovando...' : 'Simular confirmação Pix'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent flex items-center justify-center mb-4 text-accent">
                  <Check size={20} />
                </div>
                
                <h4 className="text-[16px] font-bold text-white mb-4">
                  PAGAMENTO CONFIRMADO!
                </h4>

                <div className="text-left w-full bg-black/35 border border-border-subtle p-5 rounded-[8px] mb-6 flex flex-col gap-2">
                  <p className="text-accent font-semibold text-[10px] tracking-wider uppercase mb-1 font-rework">
                    // Próximos passos da Ordem
                  </p>
                  <p className="text-[12px] text-text-secondary">1. Verifique o e-mail cadastrado.</p>
                  <p className="text-[12px] text-text-secondary">2. Acesse nosso portal de desenvolvedor no Discord.</p>
                  <p className="text-[12px] text-text-secondary">
                    3. O bot **Hermes** gerará sua chave de API automaticamente em minutos.
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] uppercase bg-transparent text-text-primary border border-white/15 px-6 py-2.5 rounded-full hover:bg-white/5 transition-colors"
                >
                  Concluir
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
