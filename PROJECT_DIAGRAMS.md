# Ledgerly — System Diagrams & Architecture Documentation

This document contains a comprehensive architectural and engineering diagram suite for **Ledgerly (Invoice Generator)**, covering system architecture, data models, state machines, sequence workflows, and data flow pipelines.

All 14 diagrams are rendered as **Ultra-HD High-Resolution PNG images** and **lossless vector SVG files** in the [`Project Diagrams/`](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams) folder.

### 📁 Rendered Diagram Directory

| # | Diagram Title | High-Res PNG Image | Lossless Vector SVG |
|---|---|---|---|
| **01** | High-Level System Architecture | [01_system_architecture.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/01_system_architecture.png) | [01_system_architecture.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/01_system_architecture.svg) |
| **02** | Entity-Relationship Diagram (ERD) | [02_entity_relationship_diagram.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/02_entity_relationship_diagram.png) | [02_entity_relationship_diagram.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/02_entity_relationship_diagram.svg) |
| **03** | Route Navigation State Machine | [03_navigation_state_machine.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/03_navigation_state_machine.png) | [03_navigation_state_machine.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/03_navigation_state_machine.svg) |
| **04** | Invoice Lifecycle State Machine | [04_invoice_lifecycle_state_machine.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/04_invoice_lifecycle_state_machine.png) | [04_invoice_lifecycle_state_machine.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/04_invoice_lifecycle_state_machine.svg) |
| **05** | Sequence: Auth & Session Flow | [05_sequence_auth_and_session.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/05_sequence_auth_and_session.png) | [05_sequence_auth_and_session.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/05_sequence_auth_and_session.svg) |
| **06** | Sequence: Invoice Builder & Signature | [06_sequence_invoice_builder_and_signature.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/06_sequence_invoice_builder_and_signature.png) | [06_sequence_invoice_builder_and_signature.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/06_sequence_invoice_builder_and_signature.svg) |
| **07** | Sequence: Payment & Receipt Dispatch | [07_sequence_payment_and_receipt.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/07_sequence_payment_and_receipt.png) | [07_sequence_payment_and_receipt.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/07_sequence_payment_and_receipt.svg) |
| **08** | DFD Level 0: Context Diagram | [08_dfd_level_0_context_diagram.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/08_dfd_level_0_context_diagram.png) | [08_dfd_level_0_context_diagram.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/08_dfd_level_0_context_diagram.svg) |
| **09** | DFD Level 1: Functional Decomposition | [09_dfd_level_1_decomposition.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/09_dfd_level_1_decomposition.png) | [09_dfd_level_1_decomposition.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/09_dfd_level_1_decomposition.svg) |
| **10** | Component & UI Module Hierarchy | [10_component_ui_hierarchy.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/10_component_ui_hierarchy.png) | [10_component_ui_hierarchy.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/10_component_ui_hierarchy.svg) |
| **11** | Print & PDF Export Pipeline | [11_print_and_pdf_pipeline.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/11_print_and_pdf_pipeline.png) | [11_print_and_pdf_pipeline.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/11_print_and_pdf_pipeline.svg) |
| **12** | DFD Level 0: Context Data Flow | [12_dfd_level_0_detailed_flow.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/12_dfd_level_0_detailed_flow.png) | [12_dfd_level_0_detailed_flow.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/12_dfd_level_0_detailed_flow.svg) |
| **13** | DFD Level 1: Detailed Processes | [13_dfd_level_1_detailed_processes.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/13_dfd_level_1_detailed_processes.png) | [13_dfd_level_1_detailed_processes.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/13_dfd_level_1_detailed_processes.svg) |
| **14** | DFD Level 2: Invoice & Payment Settlement | [14_dfd_level_2_invoice_and_payment.png](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/14_dfd_level_2_invoice_and_payment.png) | [14_dfd_level_2_invoice_and_payment.svg](file:///c:/Users/Krushna/Documents/Projects/Invoice%20Generator/Project%20Diagrams/14_dfd_level_2_invoice_and_payment.svg) |

---

## 1. High-Level System Architecture

A bird's-eye view of the single-page application (SPA), runtime environment, persistence model, and external integration points.

```mermaid
graph TB
    subgraph ClientBrowser["User Browser Environment"]
        subgraph PresentationLayer["Presentation Layer (DOM & CSS)"]
            IndexHTML["index.html (#app, #toast)"]
            StyleCSS["style.css (Design Tokens, Themes, Print Layout)"]
        end

        subgraph ApplicationLogic["Application Core (script.js)"]
            Router["Hash Router (#/path) + Route Guard"]
            ViewControllers["View Controllers\n(Dashboard, Builder, Preview, History, Customers, Enterprise, Profile)"]
            CalcEngine["Calculation Engine\n(Subtotal, Discount %, Tax %, Grand Total)"]
            SigPad["HTML5 Canvas Signature Pad"]
            QRHelper["Payment QR & UPI Link Generator"]
            Validation["Input & Form Validator"]
        end

        subgraph ClientStorage["Client Storage (localStorage)"]
            DBUsers[("ig_users\nUser Accounts")]
            DBSession[("ig_session\nActive Session")]
            DBInvoices[("ig_invoices\nSaved Invoices")]
            DBCustomers[("ig_customers\nCustomer Directory")]
            DBEnterprises[("ig_enterprises\nEnterprise Profiles")]
            DBTheme[("ig_theme\nDark/Light Mode")]
        end
    end

    subgraph ExternalServices["External Services & Integrations"]
        GoogleFonts["Google Fonts CDN\n(Fraunces, Inter, IBM Plex Mono)"]
        QRServer["api.qrserver.com\n(Dynamic QR Code Generation)"]
        MailClient["Native Mail Client\n(mailto: Protocol Handler)"]
        PrintService["Browser Print Subsystem\n(Save as PDF / Thermal/A4 Print)"]
    end

    IndexHTML --> StyleCSS
    IndexHTML --> ApplicationLogic
    GoogleFonts -.-> StyleCSS
    Router --> ViewControllers
    ViewControllers --> CalcEngine
    ViewControllers --> SigPad
    ViewControllers --> QRHelper
    ViewControllers --> Validation
    ApplicationLogic <--> ClientStorage
    QRHelper -.-> QRServer
    ViewControllers -.-> MailClient
    ViewControllers -.-> PrintService
```

---

## 2. Entity-Relationship Diagram (ERD)

Data model relationship showing how users, enterprise profiles, customers, invoices, and line items are structured in `localStorage`.

```mermaid
erDiagram
    USER ||--o{ ENTERPRISE_PROFILE : owns
    USER ||--o{ CUSTOMER : manages
    USER ||--o{ INVOICE : creates
    USER ||--o| SESSION : has
    INVOICE ||--|{ INVOICE_ITEM : contains

    USER {
        string id PK "u_admin, uid('u')"
        string name "Full Name"
        string email "Unique Login Email"
        string password "Plaintext / Hashed string"
        string businessName "Default Business Name"
        string phone "Phone Number"
        string address "Business Postal Address"
        string upiId "Default UPI VPA"
        string taxId "Default GSTIN / Tax ID"
        string signature "Data URL / Base64 Canvas"
    }

    SESSION {
        string userId FK "References USER.id"
        boolean remember "Persistent login flag"
    }

    ENTERPRISE_PROFILE {
        string id PK "ent_default, uid('ent')"
        string userId FK "References USER.id"
        boolean isDefault "Default seller profile flag"
        string name "Business / Legal Entity Name"
        string tagline "Company Motto or Tagline"
        string email "Official Billing Email"
        string phone "Business Contact Phone"
        string address "Registered Office Address"
        string taxId "GSTIN / VAT / Tax ID"
        string currency "e.g. INR (₹), USD ($)"
        string currencySymbol "₹, $, €, £"
        string upiId "UPI ID for QR"
        string bankName "Banking Institution"
        string accountNumber "Bank Account Number"
        string ifscCode "IFSC / SWIFT Code"
        string paymentUrl "Custom Hosted Checkout URL"
        string notes "Default Invoice Terms / Notes"
    }

    CUSTOMER {
        string id PK "cust_sample_1, uid('cust')"
        string userId FK "References USER.id"
        string name "Company or Customer Name"
        string contactPerson "Primary Contact Individual"
        string email "Billing Email"
        string phone "Contact Phone"
        string address "Billing Address"
        string taxId "GSTIN / Tax ID"
        string terms "Default Payment Terms (e.g. Net 15)"
    }

    INVOICE {
        string id PK "uid('inv')"
        string userId FK "References USER.id"
        string invoiceNumber "e.g. INV-2026-001"
        date invoiceDate "YYYY-MM-DD"
        date dueDate "YYYY-MM-DD"
        string currencySymbol "₹, $, €, £"
        json seller "Snapshot of Seller / Enterprise Details"
        json customer "Snapshot of Customer Details"
        number discountPct "Discount %"
        number taxPct "Tax / GST %"
        number subtotal "Sum of line totals"
        number discount "Calculated discount amount"
        number tax "Calculated tax amount"
        number grandTotal "Net payable amount"
        string paymentTerms "Terms & Conditions"
        string notes "Invoice Remarks"
        string status "Draft | Generated | Pending | Paid"
        date paidAt "Settlement Date"
        string paymentMethod "UPI, Bank Transfer, Card, Cash..."
        string transactionRef "UTR / Cheque / Ref Number"
        string paidMessage "Receipt Acknowledgement Note"
        string signature "Data URL of Drawn Signature"
        number createdAt "Timestamp"
    }

    INVOICE_ITEM {
        string id PK "uid('it')"
        string name "Product / Service Title"
        string description "Item Details / Scope"
        number qty "Quantity"
        number price "Unit Price"
    }
```

---

## 3. Application State & Route Navigation State Machine

Describes client-side hash routing, authenticated route protection, and navigational flow between views.

```mermaid
stateDiagram-v2
    [*] --> CheckSession: App Initialized (hashchange / DOMContentLoaded)

    state CheckSession <<choice>>
    CheckSession --> DashboardView: Has Active Session (currentUser != null)
    CheckSession --> LoginView: No Session / Expired

    state "Public Views" as Public {
        LoginView: #/login\n(Email/Password Validation & Remember Me)
        RegisterView: #/register\n(New User Sign-up & Auto-Login)
        LoginView --> RegisterView: "Create account"
        RegisterView --> LoginView: "Back to login"
        LoginView --> DashboardView: Authentication Success
        RegisterView --> DashboardView: Registration Success
    }

    state "Guarded Application Shell" as AppShell {
        DashboardView: #/dashboard\n(KPI Cards, Quick Actions, Recent Invoices)
        CreateInvoiceView: #/create\n(Builder with Live Totals & Autofill)
        EditInvoiceView: #/edit?id={id}\n(Modify Existing Draft/Invoice)
        PreviewInvoiceView: #/preview?id={id}\n(Invoice Sheet, QR Code, Paid Receipt)
        HistoryView: #/history\n(Search, Filter by Status & Date)
        CustomersView: #/customers\n(Directory & Modal CRUD)
        EnterpriseView: #/enterprise\n(Multi-Profile & Bank/QR Config)
        ProfileView: #/profile\n(User Settings, Default Signature)

        DashboardView --> CreateInvoiceView: "+ Create New Invoice"
        DashboardView --> HistoryView: "View all invoices"
        DashboardView --> PreviewInvoiceView: "Click Recent Row"

        CreateInvoiceView --> PreviewInvoiceView: "Save & Preview / Generate"
        CreateInvoiceView --> HistoryView: "Save Draft"

        EditInvoiceView --> PreviewInvoiceView: "Update & Preview"

        PreviewInvoiceView --> EditInvoiceView: "Edit Invoice"
        PreviewInvoiceView --> HistoryView: "Back to Invoices"

        HistoryView --> PreviewInvoiceView: "Select Invoice"
        HistoryView --> EditInvoiceView: "Edit"

        CustomersView --> CreateInvoiceView: "Bill Customer"
        EnterpriseView --> CreateInvoiceView: "Create with Profile"
    }

    AppShell --> LoginView: Logout Action (clearSession)
```

---

## 4. Invoice Lifecycle State Machine

Illustrates how an invoice transitions across lifecycle states from creation to settlement.

```mermaid
stateDiagram-v2
    [*] --> Draft: Save as Draft (handleSave('Draft'))
    [*] --> Generated: Save & Generate (handleSave('Generated'))

    Draft --> Generated: Finalize Details & Generate Number
    Draft --> Draft: Edit & Re-save

    Generated --> Pending: Sent / Awaiting Payment
    Generated --> Paid: Immediate Payment Settlement
    Generated --> Draft: Revert to Draft

    Pending --> Paid: Record Payment (Modal Form)
    Pending --> Pending: Send Reminder Email / QR Re-scan

    Paid --> Pending: Reopen Invoice (statusSelect Change)
    Paid --> Draft: Reset Status

    state Paid {
        [*] --> WatermarkDisplayed: Add 'PAID' Watermark
        WatermarkDisplayed --> ReceiptBanner: Render Official Settled Receipt Banner
        ReceiptBanner --> EmailReceiptOption: Enable 'Email Receipt' Template
    }

    Paid --> [*]: Final Archival
```

---

## 5. Sequence Diagram: Authentication & Session Flow

The interaction between the user, browser event listener, router guard, and `localStorage`.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Merchant
    participant Browser as Browser Window
    participant Router as Hash Router & Guard
    participant AuthView as Login/Register View
    participant DB as LocalStorage (ig_users, ig_session)
    participant Dashboard as Dashboard View

    User->>Browser: Opens Application URL
    Browser->>Router: DOMContentLoaded / hashchange
    Router->>DB: getSession() & currentUser()
    alt No valid session found
        DB-->>Router: null
        Router->>AuthView: renderLogin()
        AuthView-->>User: Displays Login Form
        User->>AuthView: Submits Email & Password
        AuthView->>DB: Query ig_users by email
        alt Credentials Match
            AuthView->>DB: setSession(userId, remember)
            AuthView->>Browser: Update location.hash = '#/dashboard'
            Browser->>Router: hashchange event
            Router->>Dashboard: renderDashboard()
            Dashboard-->>User: Displays Dashboard KPI & Quick Actions
        else Invalid Credentials
            AuthView-->>User: Displays "Invalid email or password" error
        end
    else Active session exists
        DB-->>Router: User record
        Router->>Dashboard: renderDashboard()
        Dashboard-->>User: Renders Dashboard
    end
```

---

## 6. Sequence Diagram: Invoice Creation, Calculation & Signature

The data flow during invoice creation, including dynamic mathematics, profile autofill, and HTML5 canvas signature capture.

```mermaid
sequenceDiagram
    autonumber
    actor User as Merchant
    participant Builder as Invoice Builder View (#/create)
    participant Calc as computeTotals() Engine
    participant Canvas as Signature Pad Canvas
    participant Storage as LocalStorage (ig_invoices)
    participant Preview as Preview View (#/preview)

    User->>Builder: Selects Customer / Enterprise Dropdown
    Builder->>Builder: Autofills Seller & Customer Details
    User->>Builder: Adds / Modifies Line Items (Qty, Unit Price)
    Builder->>Calc: computeTotals(items, discountPct, taxPct)
    Note over Calc: subtotal = Σ(qty * price)<br/>discount = subtotal * discountPct / 100<br/>taxable = subtotal - discount<br/>tax = taxable * taxPct / 100<br/>grandTotal = subtotal - discount + tax
    Calc-->>Builder: Updates Subtotal, Discount, Tax, Grand Total in DOM
    User->>Canvas: Draws Signature with Mouse / Touch
    Canvas->>Canvas: Captures Vector Paths on Canvas 2D
    User->>Builder: Clicks "Save & Preview"
    Builder->>Canvas: toDataURL() export
    Canvas-->>Builder: Base64 Signature Image String
    Builder->>Builder: Validate Customer Name & Non-empty Items
    Builder->>Storage: Store Invoice Object with Snapshot Data
    Storage-->>Builder: OK
    Builder->>Preview: Route to #/preview?id={newInvoiceId}
    Preview-->>User: Renders Generated Invoice Sheet
```

---

## 7. Sequence Diagram: Payment Recording, QR Code Generation & Receipt Dispatch

Shows how QR codes are dynamically requested and rendered, how payments are recorded, and how receipts are emailed or printed.

```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant / Client
    participant Preview as Preview View (#/preview)
    participant QRGen as QR Helper & API
    participant QRServer as api.qrserver.com
    participant Modal as Payment Modal Form
    participant DB as LocalStorage (ig_invoices)
    participant Mail as Native Mail Client (mailto:)

    Merchant->>Preview: Opens Invoice Preview
    Preview->>QRGen: getPaymentQrTarget(invoice)
    alt Custom Checkout URL exists
        QRGen-->>Preview: Returns paymentUrl
    else UPI ID exists
        QRGen-->>Preview: Returns 'upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...'
    end
    Preview->>QRServer: GET /v1/create-qr-code/?size=200x200&data={target}
    QRServer-->>Preview: Returns Image Stream (Rendered in QR Box)

    Merchant->>Preview: Clicks "Record Payment / Mark Paid"
    Preview->>Modal: Opens Payment Modal
    Merchant->>Modal: Selects Date, Method (UPI, NEFT, Card), Enters UTR Ref & Note
    Merchant->>Modal: Clicks "Save & Display Receipt"
    Modal->>DB: Updates invoice.status='Paid', paidAt, paymentMethod, transactionRef, paidMessage
    DB-->>Modal: Saved
    Modal->>Preview: Re-render with Paid State
    Preview-->>Merchant: Displays PAID Watermark & Official Settled Receipt Banner

    Merchant->>Preview: Clicks "Email Receipt"
    Preview->>Preview: Generates Formatted Receipt Subject & Body Text
    Merchant->>Preview: Clicks "Open Mail App (mailto:)"
    Preview->>Mail: Launches window.location.href = mailto:client@email.com?subject=...&body=...
```

---

## 8. Data Flow Diagram (DFD Level 0 & Level 1)

### Level 0: Context Diagram
```mermaid
graph LR
    Merchant(["Merchant / User"]) <--> SPA["Ledgerly Application (SPA Engine)"]
    Client(["Client / Customer"]) <--> SPA
    SPA -.-> QRAPI["QR Code Generation API\n(api.qrserver.com)"]
    SPA -.-> MailApp["Default Mail Client\n(mailto:)"]
    SPA <--> LStorage[("Browser LocalStorage")]
```

### Level 1: Functional Decomposition
```mermaid
graph TD
    User(["Merchant / User"])

    subgraph Processes["System Processes"]
        P1["1.0 Auth & Session Management"]
        P2["2.0 Customer Directory Management"]
        P3["3.0 Enterprise Profile Management"]
        P4["4.0 Invoice Drafting & Math Engine"]
        P5["5.0 Payment QR & UPI Generation"]
        P6["6.0 Payment Settlement & Receipt Generator"]
        P7["7.0 Document Print & PDF Pipeline"]
    end

    subgraph DataStores["Storage Stores"]
        D1[("ig_users")]
        D2[("ig_session")]
        D3[("ig_customers")]
        D4[("ig_enterprises")]
        D5[("ig_invoices")]
    end

    User -->|Credentials| P1
    P1 <--> D1
    P1 <--> D2

    User -->|Client Data| P2
    P2 <--> D3

    User -->|Business & Bank Data| P3
    P3 <--> D4

    User -->|Items, Rates, Discounts| P4
    D3 -->|Autofill Customer| P4
    D4 -->|Autofill Enterprise| P4
    P4 <--> D5

    D5 -->|Invoice Amount & VPA| P5
    P5 -->|Dynamic QR URL| ExtQR["api.qrserver.com"]

    User -->|Payment Method & UTR| P6
    P6 <--> D5

    D5 -->|Rendered Sheet| P7
    P7 --> PrintOutput["Window Print / PDF Output"]
```

---

## 9. Component & UI Module Hierarchy

The composition of view templates, shared shell, and dynamic modals.

```mermaid
graph TD
    Root["Document (#app)"]

    subgraph Shell["Shared Shell (appShell)"]
        Sidebar["Sidebar Navigation\n- Logo & Branding\n- Nav Links (/dashboard, /create, /history, /customers, /enterprise, /profile)\n- User Card & Logout"]
        Topbar["Top Bar\n- Eyebrow & View Title\n- Theme Toggle (☀️ / 🌙)\n- Quick Action Button"]
        MainContent["Main View Content Area"]
    end

    Root --> Shell
    MainContent --> V1["Dashboard View\n- KPI Stat Grid (Total, Billed, Paid, Pending)\n- Recent Invoices Table"]
    MainContent --> V2["Invoice Builder View\n- Seller / Enterprise Section (with Autofill)\n- Customer Section (with Autofill)\n- Invoice Metadata (Date, Due, Terms)\n- Dynamic Items Table\n- Realtime Math Summary\n- Canvas Signature Pad"]
    MainContent --> V3["Invoice Preview View\n- Action Toolbar (Edit, Status, Record Payment, Email, Print)\n- Invoice Sheet\n- Paid Receipt Banner\n- Bank & UPI QR Payment Box\n- Digital Signature Display"]
    MainContent --> V4["History View\n- Search Input\n- Status Filter Dropdown\n- Date Picker Filter\n- Ledger Records Table"]
    MainContent --> V5["Customers View\n- Search Filter\n- Profile Card Grid\n- Customer Add/Edit Modal"]
    MainContent --> V6["Enterprise View\n- Search Filter\n- Enterprise Card Grid\n- Enterprise Add/Edit Modal (Bank/UPI Config)"]
    MainContent --> V7["Profile View\n- Profile Info Form\n- Password Change Form\n- Default Signature Canvas\n- Data Management (Reset DB)"]

    Root --> Toast["Toast Notification Container (#toast)"]
```

---

## 10. Print & PDF Export Execution Pipeline

Shows how CSS `@media print` rules transform the web view into a clean, borderless, single/multi-page A4 PDF invoice.

```mermaid
graph TD
    UserClick["User Clicks 'Print / Save as PDF'"] --> Trigger["window.print() Triggered"]
    Trigger --> MediaRule{"Browser Evaluates @media print"}

    subgraph HideNonPrintElements["DOM Elements Suppressed (display: none !important)"]
        H1["Sidebar Navigation (.sidebar)"]
        H2["Top Bar (.topbar)"]
        H3["Preview Action Toolbar (.preview-toolbar)"]
        H4["Modals & Overlays (.modal-overlay)"]
        H5["Interactive Buttons (.btn)"]
        H6["Toast Notifications (#toast)"]
    end

    subgraph ApplyPrintStyles["Print Layout Applied"]
        P1["Page Dimensions set to A4 with 10mm margins"]
        P2["Invoice Sheet (.invoice-sheet) background set to pure white"]
        P3["Remove box-shadows & borders"]
        P4["Watermark positioned with exact opacity (0.15)"]
        P5["Table borders & typography rendered in high-contrast ink"]
        P6["QR Code image printed at 300dpi scaling"]
    end

    MediaRule --> HideNonPrintElements
    MediaRule --> ApplyPrintStyles
    HideNonPrintElements --> Output["Print Spooler / PDF Render Engine (Save as PDF)"]
    ApplyPrintStyles --> Output
```

---

## Summary of Architecture & Technical Specifications

| Characteristic | Specification |
|---|---|
| **Architecture Type** | Client-Side Single Page Application (SPA) |
| **Frontend Technologies** | Vanilla JavaScript (ES6+), HTML5, Vanilla CSS3 |
| **State & Persistence** | Browser `localStorage` with JSON serialization (`DB.*` abstractions) |
| **Authentication** | Client-side session management with local credential verification and route guards |
| **Styling & Theming** | CSS Custom Properties (CSS variables) supporting dynamic Light / Dark mode |
| **Document Generation** | Native CSS `@media print` print layout engine converting DOM to standard A4 PDF |
| **External Dependencies** | Google Fonts, QR Server API (`api.qrserver.com`), zero npm build dependencies required |
