

/*
create shipment
1. get the data from body validate it with zod
2. now find the PO and validate its status and match the quantities of each prod if it is valid  
and calc the expecting received damaged and missing Qty 
3. create shipment 
4. find inventory for those prods and with the given warehouse
5. if no inventory found create a new one if found update it
6. update the status of PO
7. create stock mov
8. create audit log

*/