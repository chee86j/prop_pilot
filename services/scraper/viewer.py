import tkinter as tk
from tkinter import ttk
import pandas as pd
from scraper import parse_detail_page
from database import connect_db, update_auction_details
import logging

class AuctionViewer:
    def __init__(self, root):
        self.root = root
        self.root.title("Auction Data Viewer")
        
        # Load data
        self.data = pd.read_csv("merged_data.csv")
        self.current_index = 0
        
        # Create main frame
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Create widgets
        self.create_widgets()
        
        # Display first entry
        self.display_current_entry()

    def create_widgets(self):
        # Navigation buttons
        nav_frame = ttk.Frame(self.main_frame)
        nav_frame.grid(row=0, column=0, columnspan=2, pady=10)
        
        ttk.Button(nav_frame, text="Previous", command=self.prev_entry).grid(row=0, column=0, padx=5)
        ttk.Button(nav_frame, text="Next", command=self.next_entry).grid(row=0, column=1, padx=5)
        ttk.Button(nav_frame, text="Fetch Details", command=self.fetch_details).grid(row=0, column=2, padx=5)
        
        # Entry display
        self.entry_text = tk.Text(self.main_frame, height=20, width=60)
        self.entry_text.grid(row=1, column=0, pady=10)

    def display_current_entry(self):
        if 0 <= self.current_index < len(self.data):
            entry = self.data.iloc[self.current_index]
            self.entry_text.delete(1.0, tk.END)
            
            # Display basic info
            display_text = f"""
Address: {entry['address']}
Sheriff Number: {entry['sheriff_number']}
Status Date: {entry['status_date']}
Plaintiff: {entry['plaintiff']}
Defendant: {entry['defendant']}
Price: ${entry['price']}
Zillow URL: {entry['Zillow URL']}
Detail Link: {entry['detail_link']}
"""
            self.entry_text.insert(tk.END, display_text)

    def prev_entry(self):
        if self.current_index > 0:
            self.current_index -= 1
            self.display_current_entry()

    def next_entry(self):
        if self.current_index < len(self.data) - 1:
            self.current_index += 1
            self.display_current_entry()

    def fetch_details(self):
        entry = self.data.iloc[self.current_index]
        detail_link = entry['detail_link']
        
        # Fetch details from the detail page
        details = parse_detail_page(detail_link)
        
        if details:
            # Update database
            conn = connect_db()
            if conn:
                update_auction_details(conn, detail_link, details)
                conn.close()
            
            # Update display
            display_text = self.entry_text.get(1.0, tk.END)
            additional_text = f"""
Additional Details:
Court Case: {details.get('court_case', 'N/A')}
Sale Date: {details.get('sale_date', 'N/A')}
Description: {details.get('description', 'N/A')}
Upset Amount: {details.get('upset_amount', 'N/A')}
Attorney: {details.get('attorney', 'N/A')}
"""
            self.entry_text.delete(1.0, tk.END)
            self.entry_text.insert(tk.END, display_text + additional_text)

def main():
    root = tk.Tk()
    app = AuctionViewer(root)
    root.mainloop()

if __name__ == "__main__":
    main()
