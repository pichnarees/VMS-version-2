ออกแบบ Wireframe สำหรับระบบ “Vehicle Procurement Planning System” หรือ “ระบบจัดทำแผนจัดหารถยนต์ส่วนกลาง” โดยให้รวม Scenario 1.1, 1.2 และ 1.3 เป็น Scenario 0 เดียวกัน และใช้หน้าจอร่วมกันให้มากที่สุด

ระบบต้องรองรับประเภทคำขอ 3 แบบ:
1. จัดซื้อทดแทนรถเดิม
2. จัดซื้อเพิ่มเติมตามโควต้าพื้นฐาน
3. จัดซื้อเพิ่มเติมกรณีพิเศษ

แนวคิดหลัก:
ให้ผู้ใช้เริ่มจากการสร้างคำขอจัดหารถยนต์เพียงจุดเดียว จากนั้นเลือกประเภทคำขอ แล้วระบบจะแสดงข้อมูล ฟอร์ม เงื่อนไข การคำนวณ งบประมาณ และเส้นทางอนุมัติที่เหมาะสมตามประเภทคำขอ

หน้าจอหลักที่ต้องออกแบบ:

1. Vehicle Procurement Dashboard
- แสดงภาพรวมคำขอจัดหารถยนต์ทั้งหมด
- มี Summary Card เช่น คำขอทั้งหมด, ทดแทนรถเดิม, เพิ่มเติมตามโควต้า, กรณีพิเศษ, รออนุมัติ, ส่งกลับแก้ไข, อนุมัติแล้ว, อยู่ระหว่าง PR/E-Bid
- มีกราฟหรือ Progress Overview
- มีตารางรายการคำขอล่าสุด
- มี Filter ตามปีงบประมาณ, หน่วยงาน, ประเภทคำขอ, สถานะ

2. All Requests
- แสดงรายการคำขอทั้งหมด
- Column ได้แก่ เลขที่คำขอ, ประเภทคำขอ, หน่วยงาน, ปีงบประมาณ, จำนวนรถ, งบประมาณรวม, ขั้นตอนปัจจุบัน, ผู้รับผิดชอบปัจจุบัน, สถานะ, วันที่สร้าง, Action
- มี Search, Advanced Filter, Status Badge และ Request Type Badge

3. Create Vehicle Procurement Request
- ให้ผู้ใช้เลือกประเภทคำขอ 3 แบบด้วย Card
- Card 1: จัดซื้อทดแทนรถเดิม
- Card 2: จัดซื้อเพิ่มเติมตามโควต้าพื้นฐาน
- Card 3: จัดซื้อเพิ่มเติมกรณีพิเศษ
- แต่ละ Card ต้องมีคำอธิบายสั้น ๆ และปุ่ม Start Request

4. Source Data & Demand Collection
- เป็นหน้ารวบรวมข้อมูลตั้งต้นแบบ Dynamic ตามประเภทคำขอ
- ถ้าเป็นจัดซื้อทดแทนรถเดิม ให้แสดงรายการรถที่เข้าเกณฑ์ทดแทน เช่น อายุรถ, ระยะทาง, สภาพรถ, ประวัติซ่อม, เหตุผลที่เข้าเกณฑ์
- ถ้าเป็นจัดซื้อเพิ่มเติมตามโควต้าพื้นฐาน ให้แสดงข้อมูลจำนวนรถตามเกณฑ์, จำนวนรถที่มีอยู่, จำนวนที่ขาด, หน่วยงาน, พื้นที่, ภารกิจ
- ถ้าเป็นจัดซื้อเพิ่มเติมกรณีพิเศษ ให้แสดงข้อมูลคำขอพิเศษ, เหตุผลกรณีพิเศษ, โครงการ/สัญญาที่เกี่ยวข้อง, ข้อมูลจากระบบ AA, เอกสารอ้างอิง
- มีปุ่ม Continue to Analysis

5. Vehicle Requirement Analysis
- วิเคราะห์จำนวนรถที่ต้องจัดหา
- ใช้หน้าร่วมกัน แต่ปรับ Section ตามประเภทคำขอ
- สำหรับทดแทนรถเดิม: แสดง Replacement Analysis และรายการรถที่เข้าเกณฑ์
- สำหรับโควต้าพื้นฐาน: แสดง Gap Analysis ระหว่างจำนวนรถตามเกณฑ์และจำนวนรถที่มีอยู่
- สำหรับกรณีพิเศษ: แสดง Special Criteria Checklist, Evidence Verification และจำนวนที่ผ่านเกณฑ์พิเศษ
- ต้องมี Calculation Result Card แสดงจำนวนรถที่เสนอจัดหา
- มีปุ่ม Confirm Analysis และ Adjust Criteria

6. Vehicle Procurement Plan Form
- เป็น Step Form กลางสำหรับจัดทำแผน
- Step 1: Request Information
- Step 2: Requirement Details
- Step 3: Vehicle Items
- Step 4: Budget & Reference Price
- Step 5: Attachments
- Step 6: Review
- ข้อมูลที่ต้องมี ได้แก่ ชื่อแผน, ประเภทคำขอ, ปีงบประมาณ, หน่วยงาน, ประเภทรถ, จำนวนรถ, ราคาประมาณการ, ราคากลาง, งบลงทุน, แหล่งงบประมาณ, เหตุผลความจำเป็น, เอกสารแนบ
- มีปุ่ม Save Draft, Previous, Next, Submit to Budget Check

7. Budget Validation
- ตรวจสอบงบประมาณของคำขอ
- แสดง Budget Summary Card ได้แก่ งบประมาณที่มี, งบประมาณที่ขอ, ส่วนต่าง, วงเงิน, สถานะงบประมาณ
- มี Budget Usage Table
- มี Validation Alert เช่น งบเพียงพอ, งบไม่เพียงพอ, เกินวงเงิน
- มีปุ่ม Return for Revision และ Submit for Approval

8. Review & Submit
- แสดงข้อมูลสรุปก่อนส่งอนุมัติ
- แสดงประเภทคำขอ, รายการรถ, จำนวนรวม, งบประมาณรวม, เหตุผล, ผลการวิเคราะห์, ผลตรวจสอบงบประมาณ, เอกสารแนบ และเส้นทางอนุมัติ
- มี Approval Route Preview
- มีปุ่ม Submit for Approval, Save Draft, Download Summary

9. Approval Inbox
- แสดงรายการที่รออนุมัติของผู้ใช้งานแต่ละ Role
- รองรับ Role เช่น กอง., คณะกรรมการ, ผู้ว่าการ, บอร์ด กฟภ., สภาพัฒน์, ครม., หน่วยงานจัดซื้อ
- Column ได้แก่ เลขที่คำขอ, ประเภทคำขอ, หน่วยงาน, จำนวนรถ, งบประมาณรวม, ขั้นตอนปัจจุบัน, วันที่ส่ง, สถานะ, Action

10. Approval Detail / Request Detail
- ใช้ร่วมกันสำหรับทุกระดับผู้อนุมัติ
- แสดง Summary, ข้อมูลคำขอ, รายการรถ, งบประมาณ, เหตุผล/หลักฐาน, เอกสารแนบ, Approval Timeline, Comment History
- มี Action Bar ตามสิทธิ์ ได้แก่ Approve, Reject, Return for Revision, Request More Information, Add Comment
- ต้องมี Modal สำหรับ Return/Reject ที่บังคับกรอกเหตุผล

11. Approval Tracking Timeline
- แสดงเส้นทางอนุมัติทั้งหมด
- Step ได้แก่ Draft, Data Collection, Requirement Analysis, Budget Check, Committee Review, Governor Approval, Board Approval, NESDC Review, Cabinet Review, Principle Approval, PR, E-Bid
- แต่ละ Step ต้องแสดงสถานะ Completed, Current, Pending, Returned, Rejected
- แสดงผู้รับผิดชอบ วันที่ ความเห็น และเอกสารแนบ

12. Procurement Handoff
- ใช้หลังคำขออนุมัติครบถ้วน
- แสดงรายการรถที่ได้รับอนุมัติ, จำนวนรถ, งบประมาณที่อนุมัติ, เอกสารอนุมัติครบถ้วน
- มีปุ่ม Principle Approval, Create PR, Send to E-Bid
- แสดง PR Number, PR Status, E-Bid Status และ Procurement Timeline

13. Settings
- สำหรับตั้งค่าเกณฑ์และเส้นทางอนุมัติ
- มีเมนูย่อย Vehicle Type, Replacement Criteria, Quota Criteria, Special Criteria, Budget Rules, Approval Route, Document Template

UX/UI Requirements:
- ออกแบบเป็น Enterprise Web Application
- ใช้ Sidebar ด้านซ้าย, Header ด้านบน และ Content Area ตรงกลาง
- ใช้ภาษาไทยทั้งหมด
- ใช้โทนสี Professional เช่น ขาว เทา น้ำเงินเข้ม และสีสถานะที่อ่านง่าย
- ทุกหน้าต้องมี Page Header พร้อม Title, Description และ Primary Action
- ใช้ Card, Table, Badge, Stepper, Timeline, Modal, Form และ Attachment Component
- ออกแบบสำหรับ Desktop ขนาด 1440px
- ใช้หน้าร่วมกันให้มากที่สุด ไม่แยกเป็น 3 ระบบ
- จุดสำคัญคือต้องทำให้ผู้ใช้รู้ว่า “คำขอนี้เป็นประเภทใด”, “อยู่ขั้นตอนไหน”, “รอใครอนุมัติ”, “ต้องทำอะไรต่อ”
- ห้ามตัดขั้นตอนสำคัญของทั้ง 3 Scenario ออก
- ให้ทำ Wireframe ที่ละเอียดพอสำหรับนำไปพัฒนาต่อ