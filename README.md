

Skeleton:
https://github.com/mars/create-react-app-buildpack#user-content-quick-start

3-d region occupied by "planets": 1500-px wide x 600-px tall x 600-px deep, pyramidally shaped.
x, y, and z are 3-d coords
z = 0 at viewer, z>0 otherwise, zmin = 10px
objects closer to view appear larger (apparent lateral size inversely proportional to z: viewer distance)
X and Y are apparent lateral positions of planets, expanded more if closer to viewer
borders of paths between planets = segment that is tangent to both planets
2 x 2 = 4 components: atop vs below, and solid (zIndex = -z) vs dashed (zIndex = 0)

middle column is factorial base:

factorial base,
lexographic ordering needed in order to have a highly reusable (ie, small) memo.  Space complexity = ?

permutations:
iterPerm -> itin:
e.g.: n = 4 and iterPerm = 07 -> 1010 -> 1(023), 10(23), 103(2), 1032
*00(23) -> 0000(3210) -> 0123
01(17) -> 0010(2210) -> 0132
*02(21) -> 0100(3110) -> 0213
03(11) -> 0110(1210) -> 0231
04(15) -> 0200(2110) -> 0312
05(09) -> 0210(1110) -> 0321
06(22) -> 1000(3200) -> 1023
*07(16) -> 1010(2200) -> 1032
08(19) -> 1100(3010) -> 1203
09(05) -> 1110(0210) -> 1230
*10(13) -> 1200(2010) -> 1302
11(03) -> 1210(0110) -> 1320
12(20) -> 2000(3100) -> 2013
*13(10) -> 2010(1200) -> 2031
14(18) -> 2100(3000) -> 2103
15(04) -> 2110(0200) -> 2130
*16(07) -> 2200(1010) -> 2301
17(01) -> 2210(0010) -> 2310
18(14) -> 3000(2100) -> 3012
19(08) -> 3010(1100) -> 3021
20(12) -> 3100(2000) -> 3102
*21(02) -> 3110(0100) -> 3120
22(06) -> 3200(1000) -> 3201
*23(00) -> 3210(0000) -> 3210
