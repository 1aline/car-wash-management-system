# CWSMS ERD (for drawing on paper)

Draw these entities on paper with crow's foot notation:

1. `Package`  
   - `PackageNumber` (PK)  
   - `PackageName`  
   - `PackageDescription`  
   - `PackagePrice`

2. `Car`  
   - `PlateNumber` (PK)  
   - `CarType`  
   - `CarSize`  
   - `DriverName`  
   - `PhoneNumber`

3. `ServicePackage`  
   - `RecordNumber` (PK)  
   - `ServiceDate`  
   - `PlateNumber` (FK -> `Car.PlateNumber`)  
   - `PackageNumber` (FK -> `Package.PackageNumber`)

4. `Payment`  
   - `PaymentNumber` (PK)  
   - `AmountPaid`  
   - `PaymentDate`  
   - `RecordNumber` (FK -> `ServicePackage.RecordNumber`)

Relationships/cardinalities:

- One `Car` can have many `ServicePackage` records (1:N).
- One `Package` can be used in many `ServicePackage` records (1:N).
- One `ServicePackage` record can have many `Payment` records (1:N), or keep one latest payment for strict one-to-one business rule.

## Initial package data

- `Basic wash` | `Exterior hand wash` | `5000`
- `Classic wash` | `Interior hand wash` | `10000`
- `Premium wash` | `Exterior and Interior hand wash` | `20000`

The backend auto-seeds these packages on startup in MongoDB.
