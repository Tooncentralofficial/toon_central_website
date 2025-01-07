import React from 'react'

const Returnpolicy = () => {
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap mt-5">
        <div className="return-refund-policy">
          <h4 className="text-xl lg:text-[40px] mb-8">
            Return and Refund Policy
          </h4>
          {/* <p>
            <strong>Effective Date:</strong> 5th December, 2024
            <br />
            <strong>Last Updated:</strong> 12th December, 2024
          </p> */}
          <p>
            Toon Central is committed to providing high-quality comic-related
            products and services to its customers. This Return and Refund
            Policy outlines the terms under which returns, exchanges, and
            refunds are processed for purchases made on our website, platform,
            or through other Toon Central sales channels. By purchasing our
            products or services, you agree to the terms and conditions of this
            policy.
          </p>

          {/* Definitions */}
          <div className="mt-5">
            <h4>DEFINITIONS</h4>
            <ul className="list-disc pl-6">
              <li>
                <strong>&quot;Toon Central&quot;:</strong> Refers to our company, a
                Nigeria-based entity specializing in comic production with
                national and international operations.
              </li>
              <li>
                <strong>&quot;Customer&quot; or &quot;You&quot;:</strong> Refers to any individual
                or entity purchasing products or services from Toon Central.
              </li>
              <li>
                <strong>&quot;Product&quot;:</strong> Refers to physical or digital goods
                offered by Toon Central, including but not limited to comics,
                merchandise, artwork, and digital downloads.
              </li>
              <li>
                <strong>&quot;Service&quot;:</strong> Refers to non-tangible offerings by
                Toon Central, such as subscriptions, licensing, or digital
                access to content.
              </li>
            </ul>
          </div>

          {/* Eligibility for Returns */}
          <div className="mt-5">
            <h4>ELIGIBILITY FOR RETURNS</h4>
            <ul className="list-disc pl-6">
              <li>
                <strong>Physical Products:</strong> Physical products may be
                eligible for return under the following conditions:
                <ul className="list-disc pl-6">
                  <li>
                    The item is in its original condition, unused, and in its
                    original packaging.
                  </li>
                  <li>
                    The return request is initiated within 14 days of receiving
                    the product.
                  </li>
                  <li>
                    The product is accompanied by the original receipt or proof
                    of purchase.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Digital Products:</strong> Due to the nature of digital
                products, they are non-returnable and non-refundable, except in
                the following cases:
                <ul className="list-disc pl-6">
                  <li>The product is defective or corrupt upon download.</li>
                  <li>
                    The incorrect product was delivered due to an error by Toon
                    Central.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Services:</strong> Refunds for services are available on
                a case-by-case basis under the following circumstances:
                <ul className="list-disc pl-6">
                  <li>The service was not provided as described.</li>
                  <li>
                    A technical error or system issue prevented access to the
                    purchased service.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Non-Eligible Items:</strong> The following items are not
                eligible for returns or refunds:
                <ul className="list-disc pl-6">
                  <li>Customized or personalized products.</li>
                  <li>Discounted or sale items unless they are defective.</li>
                  <li>
                    Items damaged by improper use, mishandling, or unauthorized
                    repairs.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Return Process */}
          <div className="mt-5">
            <h4>RETURN PROCESS</h4>
            <p>To initiate a return, follow these steps:</p>
            <ol className="list-decimal pl-6">
              <li>
                <strong>Step 1: Initiating a Return Request</strong>
                <p>
                  Contact Toon Central Customer Support at:
                  <br />
                  Email:{" "}
                  <a href="mailto:tcadmin@tooncentralhub.com">
                    tcadmin@tooncentralhub.com
                  </a>
                  <br />
                  Phone: +2348148292571
                </p>
                <p>Include the following information:</p>
                <ul className="list-disc pl-6">
                  <li>Order number and date of purchase.</li>
                  <li>Description of the item to be returned.</li>
                  <li>Reason for the return.</li>
                  <li>
                    Supporting evidence (e.g., photos of a damaged product).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Step 2: Approval and Instructions</strong>
                <p>
                  If your return request is approved, Toon Central will provide
                  a Return Merchandise Authorization (RMA) number and return
                  instructions.
                </p>
              </li>
              <li>
                <strong>Step 3: Shipping the Item</strong>
                <ul className="list-disc pl-6">
                  <li>
                    Customers are responsible for return shipping costs unless
                    the return is due to Toon Central’s error.
                  </li>
                  <li>
                    Returns must be sent to the address provided in the
                    instructions.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Step 4: Inspection and Refund Processing</strong>
                <p>
                  Once we receive the returned item, we will inspect it to
                  ensure it meets the eligibility criteria. Refunds or
                  replacements will be processed within 7-10 business days after
                  inspection.
                </p>
              </li>
            </ol>
          </div>

          {/* Refund Policy */}
          <div className="mt-5">
            <h4>REFUND POLICY</h4>
            <ul className="list-disc pl-6">
              <li>
                <strong>Refund Eligibility:</strong> Refunds are issued under
                the conditions outlined in the eligibility criteria.
              </li>
              <li>
                <strong>Types of Refunds:</strong> Refunds may be processed as:
                <ul className="list-disc pl-6">
                  <li>
                    Original Payment Method: Credit/debit card, PayPal, or bank
                    transfer.
                  </li>
                  <li>
                    Store Credit: Opt for store credit for future purchases.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Non-Refundable Charges:</strong> Shipping, handling, and
                taxes are non-refundable.
              </li>
            </ul>
          </div>

          {/* Additional Sections */}
          <div className="mt-5">
            <h4>ADDITIONAL TERMS</h4>
            <ul className="list-disc pl-6">
              <li>
                <strong>Damaged or Defective Items:</strong> Notify us within 48
                hours and provide evidence. Defective items will be replaced or
                refunded.
              </li>
              <li>
                <strong>International Returns:</strong> Customers are
                responsible for customs duties and shipping costs for returns
                unless the item is defective or incorrect.
              </li>
              <li>
                <strong>Nigerian Consumers:</strong> Complies with the Nigerian
                Consumer Protection Council (CPC) guidelines.
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mt-5">
            <h4>CONTACT INFORMATION</h4>
            <p>
              For questions or concerns regarding returns and refunds, contact
              us at:
              <br />
              Email:{" "}
              <a href="mailto:tcadmin@tooncentralhub.com">
                tcadmin@tooncentralhub.com
              </a>
              <br />
              Phone: +2348148292571
              <br />
              Address: 11 Chiene Street, Achara Layout, Enugu, Enugu State.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Returnpolicy