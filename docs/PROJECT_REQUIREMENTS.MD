# WarehouseFlow
this is the name of our software

## Problem Statement
TechWarehouse currently manages warehouse operations using Excel sheets and manual records.

This causes inaccurate inventory counts, duplicate entries, missing shipment history, poor traceability, and difficulty identifying who performed important actions.

WarehouseFlow provides a centralized platform that manages inventory, warehouses, purchases, sales, employees and reporting while maintaining a complete history of every business operation.

## Goals
Provide real-time inventory visibility.

Reduce manual errors.

Prevent unauthorized modifications.

Maintain complete inventory history.

Generate accurate reports.

Support multiple warehouses.

Improve operational efficiency.

## User Roles
there will be following roles as on our requirements.
1. admin or owner
2. warehouse workers
3. sales manager
4. accountant
5. Manager

## Functional Requirements
1. admin
- admin can add users and products
- can also delete edit or block users or products only he can do that
- manage the whole dashboard create, del, edit purchase orders

2. workers
- receive shipments verify products
- enter received products and damaged products in any
- report if there are products more than expected
- workers cannot edit purchase orders or inventory

3. sales manager
- sell products to customers
- generate invoices 

4. accountant
- views revenues loss and report to manager

5. Manager
- can review orders purchase shipments but cannot edit them

## Business Rules
- only admin can create users and products and purchase orders
- workers cannot change directory 
- there will be a record of every stock movement and audit 
logs
- A Purchase Order cannot be deleted after receiving inventory.
- if one order is being processed other cannot be created and the inventory can never be in negative 
- if there is any issue in the quantity of the products at the time of shipment only admin can change quantity or inventory
- Every inventory change creates a Stock Movement.
- 
- every shipment must be recorded only once, always update its status to received to prevent double records


## Modules
- authentication
- inventory 
- warehouses
- products
- different users
- audit logs
- stock movement
- sales record
- purchase orders
- invoices
- dashboard

## User Journey

Admin

↓

Creates Purchase Order

↓

Supplier delivers products

↓

Warehouse Worker verifies shipment

↓

Inventory updated

↓

Stock Movement created

↓

Customer purchases products

↓

Sales Employee creates Sales Order

↓

Invoice generated

↓

Inventory reduced

↓

Accountant views revenue

↓

Admin views analytics


