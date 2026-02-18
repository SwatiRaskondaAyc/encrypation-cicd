import logging
from typing import Dict, List, Optional
from Portfolio_Analysis.WhatIf.peer_fetcher import PeerFetcher
from Portfolio_Analysis.WhatIf.simulator import PortfolioSimulator
from Portfolio_Analysis.WhatIf.holdings_enricher import enrich_holdings_with_sector

logger = logging.getLogger(__name__)

class WhatIfOrchestrator:
    """
    Orchestrates What-If simulation workflows.
    Coordinates between API validation, PeerFetcher, and PortfolioSimulator.
    """
    
    def __init__(self):
        self.peer_fetcher = PeerFetcher()
        self.simulator = PortfolioSimulator()

    def get_holdings_with_peers(self, current_holdings: List[Dict]) -> Dict:
        """
        Enriches current holdings with sector/industry info and hierarchy of peer stocks.
        """
        enriched_holdings = []
        
        for holding in current_holdings:
            symbol = holding.get('symbol')
            # Initialize with holding data
            enriched = holding.copy()
            
            if symbol:
                # Fetch hierarchy
                hierarchy = self.peer_fetcher.get_peers_by_sector_hierarchy(symbol)
                
                if "error" not in hierarchy:
                    enriched['sector'] = hierarchy.get('sector')
                    enriched['industry'] = hierarchy.get('industry')
                    enriched['peers_by_sector'] = hierarchy.get('peers_by_sector')
                else:
                    enriched['error'] = hierarchy['error']
                    # Keep basic data even if peer fetch fails
                    
            enriched_holdings.append(enriched)
            
        return {"holdings": enriched_holdings}

    def preview_swap(self, current_holdings: List[Dict], swap_config: Dict) -> Dict:
        """
        Calculates swap mechanics (quantity, cost) without full metric simulation.
        """
        return self._generate_preview(current_holdings, swap_config)
    
    def execute_simulation(self, current_holdings: List[Dict], swap_config: Dict, current_metrics: Optional[Dict] = None) -> Dict:
        """
        Execute full simulation with metric calculation.
        Enriches holdings with sector data first.
        
        Args:
            current_holdings: List of holdings
            swap_config: Swap configuration
            current_metrics: Optional pre-calculated metrics from main dashboard
        """
        # Enrich holdings with sector/industry data for pie charts
        enriched_holdings = enrich_holdings_with_sector(current_holdings)
        return self.simulator.simulate_swap(enriched_holdings, swap_config, current_metrics=current_metrics)

    def get_batch_peers_flat(self, symbols: List[str]) -> Dict:
        """
        Returns flat peer list for multiple symbols.
        """
        return self.peer_fetcher.get_batch_peers(symbols)

    def get_sector_hierarchy(self, symbol: str) -> Dict:
        """
        Returns sector hierarchy for a single symbol.
        """
        return self.peer_fetcher.get_peers_by_sector_hierarchy(symbol)

    def get_all_sectors(self) -> List[str]:
        """
        Returns list of all available sectors.
        """
        return self.peer_fetcher.get_all_sectors()

    def get_hierarchy_by_sector_name(self, sector_name: str) -> Dict:
        """
        Returns hierarchy for a specific sector name.
        """
        return self.peer_fetcher.get_hierarchy_by_sector(sector_name)

    def _generate_preview(self, current_holdings: List[Dict], swap_config: Dict) -> Dict:
        try:
            source_sym = swap_config.get('source_symbol')
            target_sym = swap_config.get('target_symbol')
            action = swap_config.get('action')
            
            # Find source holding (if applicable)
            source_holding = None
            if source_sym:
                source_holding = next((h for h in current_holdings if h.get('symbol') == source_sym), None)
            
            # Fetch target price
            target_price = self.simulator._get_latest_price(target_sym)
            if target_price <= 0:
                return {"error": f"Invalid price for target {target_sym}"}

            preview = {
                "source": {
                    "symbol": source_sym,
                    "current_quantity": source_holding['quantity'] if source_holding else 0,
                    "current_price": source_holding['current_price'] if source_holding else 0
                },
                "target": {
                    "symbol": target_sym,
                    "current_price": target_price
                },
                "action": action
            }
            
            # Logic for different actions
            if action == 'SWAP_ALL':
                if not source_holding: return {"error": f"Source stock {source_sym} not in holdings"}
                
                # Use current value of source to buy target
                val = float(source_holding['quantity']) * float(source_holding['current_price'])
                qty_new = val / target_price
                
                preview['source']['quantity_to_swap'] = source_holding['quantity']
                preview['source']['value_to_swap'] = val
                preview['target']['quantity_to_buy'] = qty_new
                preview['target']['total_cost'] = val
                preview['description'] = f"Swap ALL {source_holding['quantity']} shares of {source_sym} for ~{qty_new:.2f} shares of {target_sym}"
                
            elif action == 'SWAP_QTY':
                if not source_holding: return {"error": f"Source stock {source_sym} not in holdings"}
                
                qty_in = float(swap_config.get('quantity', 0))
                # Cap at max available
                if qty_in > source_holding['quantity']: 
                    qty_in = source_holding['quantity']
                
                val = qty_in * float(source_holding['current_price'])
                qty_new = val / target_price
                
                preview['source']['quantity_to_swap'] = qty_in
                preview['source']['value_to_swap'] = val
                preview['target']['quantity_to_buy'] = qty_new
                preview['target']['total_cost'] = val
                preview['description'] = f"Swap {qty_in} shares of {source_sym} for ~{qty_new:.2f} shares of {target_sym}"

            elif action == 'REPLACE_SHARES':
                 if not source_holding: return {"error": f"Source stock {source_sym} not in holdings"}
                 
                 qty = float(source_holding['quantity'])
                 # Cost to buy matching quantity of target
                 cost = qty * target_price
                 # Value of source sold
                 old_val = qty * float(source_holding['current_price'])
                 diff = cost - old_val
                 
                 preview['source']['quantity_to_swap'] = qty
                 preview['target']['quantity_to_buy'] = qty
                 preview['target']['total_cost'] = cost
                 preview['capital_required'] = diff
                 preview['description'] = f"Replace {qty} shares of {source_sym} with {qty} shares of {target_sym}. " + \
                                          f"({'Additional cost' if diff > 0 else 'Cash released'}: {abs(diff):.2f})"
                 
            elif action == 'ADD_FUNDS':
                amount = float(swap_config.get('amount', 0))
                qty_new = amount / target_price
                
                preview['target']['quantity_to_buy'] = qty_new
                preview['target']['total_cost'] = amount
                preview['description'] = f"Invest {amount} in {target_sym} -> ~{qty_new:.2f} shares"

            return {"preview": preview}

        except Exception as e:
            logger.error(f"Preview Error: {e}", exc_info=True)
            return {"error": str(e)}
