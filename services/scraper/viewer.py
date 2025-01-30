from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QPushButton, 
                           QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, 
                           QTextEdit, QMessageBox, QScrollArea, QTableWidget,
                           QTableWidgetItem, QDialog, QFormLayout)
from PyQt6.QtCore import Qt
import pandas as pd
import sqlite3
import sys
import logging

class EditDialog(QDialog):
    def __init__(self, entry_data, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Edit Entry Details")
        self.setMinimumWidth(400)
        
        layout = QFormLayout()
        
        # Create input fields
        self.fields = {}
        field_names = ['Court Case #:', 'Sales Date:', 'Description:', 'Approx. Upset*:', 'Attorney:']
        
        for field in field_names:
            if field == 'Description:':
                self.fields[field] = QTextEdit()
                self.fields[field].setPlainText(entry_data.get(field, ''))
            else:
                self.fields[field] = QLineEdit()
                self.fields[field].setText(entry_data.get(field, ''))
            layout.addRow(field, self.fields[field])
        
        # Add Save and Cancel buttons
        button_layout = QHBoxLayout()
        save_button = QPushButton("Save")
        cancel_button = QPushButton("Cancel")
        save_button.clicked.connect(self.accept)
        cancel_button.clicked.connect(self.reject)
        button_layout.addWidget(save_button)
        button_layout.addWidget(cancel_button)
        layout.addRow(button_layout)
        
        self.setLayout(layout)
    
    def get_values(self):
        return {
            field: (self.fields[field].toPlainText() if isinstance(self.fields[field], QTextEdit)
                   else self.fields[field].text())
            for field in self.fields
        }

class AuctionViewer(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Auction Data Viewer")
        self.setMinimumSize(1200, 800)
        
        # Load data
        self.load_data()
        
        # Create main widget and layout
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout(main_widget)
        
        # Create table
        self.table = QTableWidget()
        self.setup_table()
        layout.addWidget(self.table)
        
        # Create button layout
        button_layout = QHBoxLayout()
        edit_button = QPushButton("Edit Selected")
        edit_button.clicked.connect(self.edit_selected)
        button_layout.addWidget(edit_button)
        layout.addLayout(button_layout)
    
    def load_data(self):
        try:
            self.data = pd.read_csv("merged_data.csv")
            # Initialize database connection
            self.conn = sqlite3.connect('auction_data.db')
            self.cursor = self.conn.cursor()
            
            # Ensure all records from merged_data.csv are in the database
            for _, row in self.data.iterrows():
                self.cursor.execute('''
                    INSERT OR IGNORE INTO auctions 
                    (detail_link, sheriff_number, status_date, plaintiff, defendant, address, price)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    row['detail_link'],
                    row['sheriff_number'],
                    row['status_date'],
                    row['plaintiff'],
                    row['defendant'],
                    row['address'],
                    row['price']
                ))
            self.conn.commit()
            
        except sqlite3.OperationalError as e:
            QMessageBox.critical(self, "Database Error", 
                "Database schema is not initialized. Please run 'python migrate_db.py' first.")
            raise SystemExit(1)
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to load data: {str(e)}")
            raise SystemExit(1)
    
    def setup_table(self):
        # Set up table columns
        columns = ['Address', 'Sheriff Number', 'Status Date', 'Court Case #',
                  'Sales Date', 'Description', 'Approx. Upset*', 'Attorney']
        self.table.setColumnCount(len(columns))
        self.table.setHorizontalHeaderLabels(columns)
        
        # Populate table
        self.table.setRowCount(len(self.data))
        for i, row in self.data.iterrows():
            self.table.setItem(i, 0, QTableWidgetItem(str(row['address'])))
            self.table.setItem(i, 1, QTableWidgetItem(str(row['sheriff_number'])))
            self.table.setItem(i, 2, QTableWidgetItem(str(row['status_date'])))
            
            # Initialize empty cells for additional columns
            for col in range(3, len(columns)):
                self.table.setItem(i, col, QTableWidgetItem(''))
            
            try:
                # Get additional details from database
                self.cursor.execute('''
                    SELECT court_case, sale_date, description, upset_amount, attorney
                    FROM auctions WHERE detail_link = ?
                ''', (row['detail_link'],))
                result = self.cursor.fetchone()
                
                if result:
                    self.table.setItem(i, 3, QTableWidgetItem(str(result[0] or '')))
                    self.table.setItem(i, 4, QTableWidgetItem(str(result[1] or '')))
                    self.table.setItem(i, 5, QTableWidgetItem(str(result[2] or '')))
                    self.table.setItem(i, 6, QTableWidgetItem(str(result[3] or '')))
                    self.table.setItem(i, 7, QTableWidgetItem(str(result[4] or '')))
            except sqlite3.OperationalError as e:
                logging.error(f"Database error: {e}")
                QMessageBox.warning(self, "Database Error", 
                    "The database schema needs to be updated. Please run migrate_db.py first.")
                self.close()
                return
        
        # Adjust column widths
        self.table.resizeColumnsToContents()
    
    def edit_selected(self):
        current_row = self.table.currentRow()
        if current_row < 0:
            QMessageBox.warning(self, "Warning", "Please select a row to edit")
            return
        
        # Get current values
        current_values = {
            'Court Case #:': self.table.item(current_row, 3).text(),
            'Sales Date:': self.table.item(current_row, 4).text(),
            'Description:': self.table.item(current_row, 5).text(),
            'Approx. Upset*:': self.table.item(current_row, 6).text(),
            'Attorney:': self.table.item(current_row, 7).text()
        }
        
        # Show edit dialog
        dialog = EditDialog(current_values, self)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            try:
                new_values = dialog.get_values()
                detail_link = self.data.iloc[current_row]['detail_link']
                
                # Update database
                self.cursor.execute('''
                    UPDATE auctions
                    SET court_case = ?,
                        sale_date = ?,
                        description = ?,
                        upset_amount = ?,
                        attorney = ?,
                        last_updated = CURRENT_TIMESTAMP
                    WHERE detail_link = ?
                ''', (
                    new_values['Court Case #:'],
                    new_values['Sales Date:'],
                    new_values['Description:'],
                    new_values['Approx. Upset*:'],
                    new_values['Attorney:'],
                    detail_link
                ))
                self.conn.commit()

                # Update CSV file
                from database import sync_db_to_csv
                sync_db_to_csv(self.conn)
                
                # Update table display
                self.table.item(current_row, 3).setText(new_values['Court Case #:'])
                self.table.item(current_row, 4).setText(new_values['Sales Date:'])
                self.table.item(current_row, 5).setText(new_values['Description:'])
                self.table.item(current_row, 6).setText(new_values['Approx. Upset*:'])
                self.table.item(current_row, 7).setText(new_values['Attorney:'])

                # Reload data from updated CSV
                self.data = pd.read_csv("merged_data.csv")
                
                QMessageBox.information(self, "Success", "Entry updated successfully!")
                
            except Exception as e:
                self.conn.rollback()
                QMessageBox.critical(self, "Error", f"Failed to save changes: {str(e)}")
                logging.error(f"Error saving changes: {e}")

    def closeEvent(self, event):
        self.conn.close()
        event.accept()

def main():
    app = QApplication(sys.argv)
    viewer = AuctionViewer()
    viewer.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
